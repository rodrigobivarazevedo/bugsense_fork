from fastapi import UploadFile, File, Query, APIRouter, status, Request
from fastapi.responses import JSONResponse
from app.core.security import get_current_user
from app.core.config import secrets_manager
from app.utils.upload import save_file_locally, upload_image_to_gcs
from typing import Optional
from fastapi import Request, HTTPException  # ← Needed

router = APIRouter(prefix="/upload", tags=["Uploads"])

# uploads/{qr_data}/{YYYY-MM-DD}/time{timestamp}.jpg

@router.post(
    "/",
    summary="Process and save an image locally or to GCS",
    status_code=status.HTTP_201_CREATED,
)
async def upload_image(
    request: Request,
    qr_data: str = Query(...),
    image: UploadFile = File(...),
    storage: str = Query("local", enum=["local", "gcs"]),
):
    
    token = await get_current_user(request)
    
    try:
        if storage == "gcs":
            # Upload to GCS
            image.file.seek(0)
            gcs_url = upload_image_to_gcs(
                file_obj=image.file,
                filename=image.filename,
                qr_data=qr_data,
                bucket_name=secrets_manager.security_secrets.get("GCS_BUCKET_NAME"),
                credentials_json=secrets_manager.security_secrets.get("GOOGLE_CREDENTIALS")
            )
            
            if not gcs_url:
                return JSONResponse(
                    status_code=400,
                    content={
                        "message": "Failed to upload image to Google Cloud Storage.",
                    }
            )
            
            message = "Image uploaded to Google Cloud Storage."
           
        else:
            # Save locally using the reusable function
            file_path = save_file_locally(image, qr_data)
            
            if not file_path:
                return JSONResponse(
                    status_code=400,
                    content={
                        "message": "Failed to upload image locally.",
                    }
            )
            
            message = "Image uploaded locally."
            
        # try to predict and send results to main backend
        await send_results(request, qr_data, storage=storage)
            
        return JSONResponse(
                status_code=200,
                content={
                    "message": message,
                }
            )
    except Exception as e:
        print("Upload error:", e)
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


import httpx

async def send_results(
    request: Request,
    qr_data: str,
    storage: Optional[str] = "local"
):
    # Extract access token from headers (same as get_current_user does)
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing.")

    # Build query parameters
    query_params = {
        "qr_data": qr_data,
        "storage": storage,
    }
    
    headers = {
        "Authorization": auth_header
    }

    async with httpx.AsyncClient(base_url="http://ml_service:5001/ml_api") as client:
        try:
            # Fire off both requests concurrently using asyncio.gather
            species_response =  await client.get("/prediction/species/", params=query_params, headers=headers)
            concentration_response = await client.get("/prediction/concentration/", params=query_params, headers=headers)
            
            if species_response.status_code != 200:
                raise HTTPException(
                    status_code=species_response.status_code, 
                    detail=f"Species prediction failed: {species_response.text}"
                )

            if concentration_response.status_code != 200:
                raise HTTPException(
                    status_code=concentration_response.status_code, 
                    detail=f"Concentration prediction failed: {concentration_response.text}"
                )
            
            predictions =  {
                "species_prediction": species_response.json(),
                "concentration_prediction": concentration_response.json()
            }
            concentration = predictions["concentration_prediction"].get('concentration')
            species = predictions["species_prediction"].get('species')
            
            if concentration is None or species is None:
                print("no results")
                return 
            
            print("prediction ready")
            print("species", species)
            print("concentration", concentration)
            
        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"HTTPX request error: {str(e)}")

        except Exception as e:
            print("Prediction error:", e)
            raise HTTPException(status_code=500, detail="Failed to retrieve predictions.")
            
            
    # Send results to Django backend
    HOST_IP = secrets_manager.security_secrets.get("HOST_IP", "http://localhost:8000")
    ML_API_KEY = secrets_manager.security_secrets.get("ML_API_KEY")
    
    async with httpx.AsyncClient(base_url=f"http://{HOST_IP}:8000") as client:
        try:
            headers = {
                "Content-Type": "application/json",
                "X-ML-API-Key": ML_API_KEY,
            }
            payload = {
                "qr_data": qr_data,
                "species": species if species else None,
                "concentration": concentration,
                "infection_detected": True if concentration == "high" else False
            }
            
            post_response = await client.post("/api/results/", json=payload, headers=headers)

            if post_response.status_code != 201:
                raise HTTPException(
                    status_code=post_response.status_code, 
                    detail=f"Posting results failed: {post_response.text}"
                )

        except httpx.RequestError as e:
            raise HTTPException(status_code=500, detail=f"HTTPX request error: {str(e)}")

        except Exception as e:
            print("Prediction error:", e)
            raise HTTPException(status_code=500, detail="Failed to retrieve predictions.")
