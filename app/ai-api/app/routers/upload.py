from fastapi import UploadFile, File, Query, APIRouter, status
from fastapi.responses import JSONResponse
from datetime import datetime
import os
import shutil
from google.cloud import storage

router = APIRouter(prefix="/upload", tags=["Uploads"])

UPLOAD_DIR = "storage/uploads"  # Directory to store uploaded images

GCS_BUCKET_NAME = "your-bucket-name"
GCS_CREDENTIALS_PATH = "path/to/your/service-account.json"  # or None if using default

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
                bucket_name=GCS_BUCKET_NAME,
                credentials_path=GCS_CREDENTIALS_PATH
            )
            return JSONResponse(
                status_code=200,
                content={
                    "message": "Image uploaded to Google Cloud Storage.",
                    "gcs_url": gcs_url
                }
            )
        else:
            # Save locally
            current_date = datetime.now().strftime("%Y-%m-%d")
            timestamp = datetime.now().strftime("%H-%M-%S-%f")
            user_folder = os.path.join(UPLOAD_DIR, user_id, current_date)
            os.makedirs(user_folder, exist_ok=True)
            file_ext = os.path.splitext(image.filename)[1]
            file_name = f"{timestamp}{file_ext}"
            file_path = os.path.join(user_folder, file_name)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
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
    if storage == "gcs":
        try:
            image_urls = list_images_from_gcs(
                user_id=user_id,
                date=date,
                bucket_name=GCS_BUCKET_NAME,
                credentials_path=GCS_CREDENTIALS_PATH
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
        folder_path = f"{UPLOAD_DIR}/{user_id}/{date}/"
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
        
        
def list_images_from_gcs(user_id: str, date: str, bucket_name: str, credentials_path: str = None):
    """
    Lists public URLs of images for a user and date in the GCS bucket.
    """
    if credentials_path:
        storage_client = storage.Client.from_service_account_json(credentials_path)
    else:
        storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    prefix = f"uploads/{user_id}/{date}/"
    blobs = bucket.list_blobs(prefix=prefix)
    urls = []
    for blob in blobs:
        blob.make_public()
        urls.append(blob.public_url)
    return urls

def upload_image_to_gcs(
    file_obj,
    filename: str,
    user_id: str,
    bucket_name: str,
    credentials_path: str = None
) -> str:
    """
    Uploads an image file to Google Cloud Storage and returns the public URL.
    """
    # Optionally set credentials
    if credentials_path:
        storage_client = storage.Client.from_service_account_json(credentials_path)
    else:
        storage_client = storage.Client()
    
    bucket = storage_client.bucket(bucket_name)
    current_date = datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%H-%M-%S-%f")
    file_ext = os.path.splitext(filename)[1]
    blob_name = f"uploads/{user_id}/{current_date}/{timestamp}{file_ext}"
    blob = bucket.blob(blob_name)
    blob.upload_from_file(file_obj, content_type="image/jpeg")  # or detect type
    blob.make_public()
    return blob.public_url
    
    
    