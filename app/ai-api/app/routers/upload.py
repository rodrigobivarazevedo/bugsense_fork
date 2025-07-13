from fastapi import UploadFile, File, Query, APIRouter, status, Request
from fastapi.responses import JSONResponse
from app.core.security import get_current_user
from app.core.config import secrets_manager
from app.utils.upload import save_file_locally, upload_image_to_gcs
from typing import Optional
from fastapi import Request, HTTPException  

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
    #token = await get_current_user(request)
    
    try:
        if storage == "gcs":
            
            bucket_name = secrets_manager.security_secrets.get("GCS_BUCKET_NAME")
            google_credentials_json = secrets_manager.security_secrets.get("GOOGLE_CREDENTIALS")
            
            if bucket_name is None or google_credentials_json is None:
                return JSONResponse(
                    status_code=400,
                    content={
                        "message": "No Google credentials found",
                    })
            
            # Upload to GCS
            image.file.seek(0)
            gcs_url = upload_image_to_gcs(
                file_obj=image.file,
                filename=image.filename,
                qr_data=qr_data,
                bucket_name=bucket_name,
                credentials_json=google_credentials_json
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
        results = await get_results(qr_data, storage=storage)
        
        return JSONResponse(
                status_code=200,
                content={
                    "message": message,
                    "results": results
                }
            )
    except Exception as e:
        print("Upload error:", e)
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


from app.routers.prediction import predict_species_core, predict_concentration_core


async def get_results(
    qr_data: str,
    storage: Optional[str] = "local"
):
    try:
        # Call prediction core functions
        species_result = await predict_species_core(qr_data, storage)
        concentration_result = await predict_concentration_core(qr_data, storage)

        species = species_result.get("species")
        concentration = concentration_result.get("concentration")

        if species is None or concentration is None:
            return None

        response = {
            "species": species,
            "concentration": concentration
        }

    except Exception as e:
        print("Prediction error:", e)
        raise HTTPException(status_code=500, detail="Prediction failed.")

    # Send to Django backend (but don't crash if it fails)
    upload_success = await post_results_to_backend(qr_data, species, concentration)
    if not upload_success:
        print("Upload failed. Returning local prediction only.")

    return response



import httpx

async def post_results_to_backend(qr_data: str, species: str, concentration: str):
    HOST_IP = secrets_manager.security_secrets.get("HOST_IP", "http://localhost:8000")
    ML_API_KEY = secrets_manager.security_secrets.get("ML_API_KEY")

    payload = {
        "qr_data": qr_data,
        "species": species,
        "concentration": concentration,
        "infection_detected": True if concentration == "high" else False
    }

    headers = {
        "Content-Type": "application/json",
        "X-ML-API-Key": ML_API_KEY,
    }

    try:
        async with httpx.AsyncClient(base_url=f"http://{HOST_IP}:8000") as client:
            post_response = await client.post("/api/results/", json=payload, headers=headers)

            if post_response.status_code != 201:
                print(f"Upload warning: {post_response.status_code}: {post_response.text}")
                return False

    except httpx.RequestError as e:
        print(f"Upload error: HTTPX request error: {str(e)}")
        return False
    except Exception as e:
        print(f"Unexpected upload error: {str(e)}")
        return False

    return True