import os
from datetime import datetime
from typing import Union
from google.cloud import storage
from google.oauth2 import service_account
import shutil
from fastapi import UploadFile
from app.core.config import secrets_manager
import re

def extract_timestamp(filename: str) -> datetime:
    base = os.path.splitext(filename)[0]
    try:
        return datetime.strptime(base, "%H-%M-%S-%f")
    except ValueError:
        return datetime.min  # Push malformed to start

def get_storage_client(credentials_json: Union[str, dict, None]):
    """
    Returns a Google Cloud Storage client using either a credentials dictionary or default.
    """
    if isinstance(credentials_json, dict):
        credentials = service_account.Credentials.from_service_account_info(credentials_json)
        return storage.Client(credentials=credentials)
    elif isinstance(credentials_json, str) and os.path.isfile(credentials_json):
        return storage.Client.from_service_account_json(credentials_json)
    else:
        return storage.Client()
    
# GET images
def list_images_gcs(bucket_name: str, prefix: str) -> list:
    client = get_storage_client(secrets_manager.security_secrets.get("GOOGLE_CREDENTIALS"))
    bucket = client.bucket(bucket_name)
    blobs = list(bucket.list_blobs(prefix=prefix))

    image_blobs = [blob for blob in blobs if blob.name.endswith(".png")]
    image_blobs.sort(key=lambda b: extract_timestamp(os.path.basename(b.name)))
    
    # image_blobs = [blob for blob in blobs if blob.name.endswith(".png")]
    #     image_blobs.sort(
    #         key=lambda x: float(re.search(r'time([0-9\.]+)[._]', x).group(1))
    #     )
    return image_blobs


# Upload
def upload_image_to_gcs(
    file_obj,
    filename: str,
    qr_data: str,
    bucket_name: str,
    credentials_json: Union[str, dict, None] = None
) -> str:
    """
    Uploads an image file to Google Cloud Storage without making it public.
    Returns the internal GCS path (not accessible to users).
    """
    storage_client = get_storage_client(bucket_name)
    bucket = storage_client.bucket(credentials_json)

    current_date = datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%H-%M-%S-%f")
    file_ext = os.path.splitext(filename)[1]
    blob_name = f"uploads/{qr_data}/{current_date}/{timestamp}{file_ext}"

    blob = bucket.blob(blob_name)
    blob.upload_from_file(file_obj, content_type="image/jpeg")

    # Do NOT make public, do NOT return URL
    return blob_name  # internal path, useful for later access


def save_file_locally(image: UploadFile, qr_data: str, base_dir: str = "storage/uploads") -> str:
    """
    Saves the uploaded file locally under base_dir/user_id/YYYY-MM-DD/timestamp.ext.
    Returns the full file path.
    """
    current_date = datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%H-%M-%S-%f")
    user_folder = os.path.join(base_dir, qr_data, current_date)
    os.makedirs(user_folder, exist_ok=True)
    file_ext = os.path.splitext(image.filename)[1]
    file_name = f"{timestamp}{file_ext}"
    file_path = os.path.join(user_folder, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    return file_path


