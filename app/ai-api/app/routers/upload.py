from fastapi import UploadFile, File, Query, APIRouter, status
from fastapi.responses import JSONResponse
import os
from app.core.security import get_current_user
from app.core.config import secrets_manager
from app.utils.upload import save_file_locally, upload_image_to_gcs, list_images_from_gcs

router = APIRouter(prefix="/upload", tags=["Uploads"])


# uploads/{user_id}/{YYYY-MM-DD}/time{timestamp}.jpg
@router.post(
    "/{user_id}",
    summary="Process and save an image locally or to GCS",
    status_code=status.HTTP_201_CREATED,
)
async def upload_image(
    user_id: str,
    image: UploadFile = File(...),
    storage: str = Query("local", enum=["local", "gcs"])
):
    try:
        if storage == "gcs":
            # Upload to GCS
            image.file.seek(0)
            gcs_url = upload_image_to_gcs(
                file_obj=image.file,
                filename=image.filename,
                user_id=user_id,
                bucket_name=secrets_manager.security_secrets.get("GCS_BUCKET_NAME"),
                credentials_path=secrets_manager.security_secrets.get("GOOGLE_CREDENTIALS")
            )
            return JSONResponse(
                status_code=200,
                content={
                    "message": "Image uploaded to Google Cloud Storage.",
                    "gcs_url": gcs_url
                }
            )
        else:
            # Save locally using the reusable function
            file_path = save_file_locally(image, user_id)
            return JSONResponse(
                status_code=200,
                content={
                    "message": "Image uploaded locally.",
                    "file_path": file_path
                }
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@router.get("/", summary="Get images for a user on a specific date")
async def get_images(
    user_id: str = Query(...),
    date: str = Query(...),
    storage: str = Query("local", enum=["local", "gcs"])
):
    """
    Returns a list of image file paths or GCS URLs for a given user_id and date (YYYY-MM-DD)
    """
    
    #token = get_current_user(request)

    if storage == "gcs":
        try:
            image_urls = list_images_from_gcs(
                user_id=user_id,
                date=date,
                bucket_name=secrets_manager.security_secrets.get("GCS_BUCKET_NAME"),
                credentials_path=secrets_manager.security_secrets.get("GOOGLE_CREDENTIALS")
            )
            if not image_urls:
                return JSONResponse(
                    status_code=404,
                    content={"error": f"No images found in GCS for user '{user_id}' on date '{date}'"}
                )
            return JSONResponse(
                status_code=200,
                content={
                    "user_id": user_id,
                    "date": date,
                    "images": image_urls
                }
            )
        except Exception as e:
            return JSONResponse(
                status_code=500,
                content={"error": str(e)}
            )
    else:
        folder_path = f"storage/upload/{user_id}/{date}/"
        if not os.path.exists(folder_path):
            return JSONResponse(
                status_code=404,
                content={"error": f"No images found for user '{user_id}' on date '{date}'"}
            )
        image_files = [
            os.path.join(folder_path, f)
            for f in os.listdir(folder_path)
            if os.path.isfile(os.path.join(folder_path, f))
        ]
        return JSONResponse(
            status_code=200,
            content={
                "user_id": user_id,
                "date": date,
                "images": image_files
            }
        )
        
        

    
    