from fastapi import UploadFile, File, Query, APIRouter, status, Request
from fastapi.responses import JSONResponse
from app.core.security import get_current_user
from app.core.config import secrets_manager
from app.utils.upload import save_file_locally, upload_image_to_gcs
from app.routers.prediction import get_species_prediction, get_concentration_prediction


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
            
            
        # try to predict
        get_species_prediction, get_concentration_prediction
            
            
        return JSONResponse(
                status_code=200,
                content={
                    "message": message,
                }
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )



        

    
    