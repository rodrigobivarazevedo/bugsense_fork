import os
from datetime import datetime
from typing import Union
from google.cloud import storage
from google.oauth2 import service_account
import shutil
from fastapi import UploadFile


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


def list_images_from_gcs(user_id: str, date: str, bucket_name: str, credentials_json: Union[str, dict, None] = None):
    """
    Lists public URLs of images for a user and date in the GCS bucket.
    """
    storage_client = get_storage_client(credentials_json)
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
    credentials_json: Union[str, dict, None] = None
) -> str:
    """
    Uploads an image file to Google Cloud Storage and returns the public URL.
    """
    storage_client = get_storage_client(credentials_json)
    bucket = storage_client.bucket(bucket_name)

    current_date = datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%H-%M-%S-%f")
    file_ext = os.path.splitext(filename)[1]
    blob_name = f"uploads/{user_id}/{current_date}/{timestamp}{file_ext}"

    blob = bucket.blob(blob_name)
    blob.upload_from_file(file_obj, content_type="image/jpeg")
    blob.make_public()

    return blob.public_url


def save_file_locally(image: UploadFile, user_id: str, base_dir: str = "storage/uploads") -> str:
    """
    Saves the uploaded file locally under base_dir/user_id/YYYY-MM-DD/timestamp.ext.
    Returns the full file path.
    """
    current_date = datetime.now().strftime("%Y-%m-%d")
    timestamp = datetime.now().strftime("%H-%M-%S-%f")
    user_folder = os.path.join(base_dir, user_id, current_date)
    os.makedirs(user_folder, exist_ok=True)
    file_ext = os.path.splitext(image.filename)[1]
    file_name = f"{timestamp}{file_ext}"
    file_path = os.path.join(user_folder, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    return file_path
