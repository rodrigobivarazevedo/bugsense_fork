import os
from io import BytesIO
from datetime import datetime

import torch
from PIL import Image
from torchvision import transforms
from torchvision.transforms import InterpolationMode
from google.cloud import storage

from app.utils.stopping_point import find_stopping_point

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def extract_timestamp(filename: str) -> datetime:
    base = os.path.splitext(filename)[0]
    try:
        return datetime.strptime(base, "%H-%M-%S-%f")
    except ValueError:
        return datetime.min  # Push malformed to start


def is_gcs_path(path: str) -> bool:
    return path.startswith("gs://")


def get_gcs_client():
    return storage.Client()


def list_images_gcs(bucket_name: str, prefix: str) -> list:
    client = get_gcs_client()
    bucket = client.bucket(bucket_name)
    blobs = list(bucket.list_blobs(prefix=prefix))

    image_blobs = [blob for blob in blobs if blob.name.endswith(".png")]
    image_blobs.sort(key=lambda b: extract_timestamp(os.path.basename(b.name)))
    return image_blobs


def get_sorted_images_by_timestamp(folder_path: str) -> list:
    if is_gcs_path(folder_path):
        # Extract bucket and prefix
        path = folder_path[5:]
        bucket_name, prefix = path.split("/", 1)
        return list_images_gcs(bucket_name, prefix)
    else:
        img_names = [img for img in os.listdir(folder_path) if img.endswith(".png")]
        img_names.sort(key=extract_timestamp)
        return img_names


def load_image_from_source(source_path: str, transform, gcs_blob=None):
    if gcs_blob:
        image_bytes = gcs_blob.download_as_bytes()
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
    else:
        img = Image.open(source_path).convert("RGB")
    return transform(img)


def load_image_series_from_folder(folder_path: str, min_hours: int = 6) -> torch.Tensor:
    img_entries = get_sorted_images_by_timestamp(folder_path)
    print(f"Found {len(img_entries)} images in {folder_path}.")

    min_index = (min_hours * 60) // 15
    if len(img_entries) <= min_index:
        print(f"Not enough images for {min_hours} hours (need >{min_index}, got {len(img_entries)}).")
        return None

    transform = transforms.Compose([
        transforms.CenterCrop((143, 40)),
        transforms.Resize((190, 40), interpolation=InterpolationMode.BICUBIC, antialias=True),
        transforms.ToTensor()
    ])

    images = []
    
    if is_gcs_path(folder_path):
        for blob in img_entries:
            img = load_image_from_source(None, transform, gcs_blob=blob)
            images.append(img)
    else:
        for img_name in img_entries:
            img_path = os.path.join(folder_path, img_name)
            img = load_image_from_source(img_path, transform)
            images.append(img)

    return torch.stack(images)


def prepare_input_tensor(images: torch.Tensor) -> torch.Tensor:
    stopping_point = find_stopping_point(images, threshold=23, mode="sliding_window")

    # Force override for testing
    stopping_point = len(images) - 1

    if stopping_point < 5:
        print("No stopping point for prediction yet")
        return None

    start = max(stopping_point - 5, 0)
    end = stopping_point

    window = images[start:end]

    print(f"Window shape: {window.shape}, Start index: {start}, End index: {end}")
    if window.shape[0] != 5:
        raise ValueError(f"Window must have 5 frames, got {window.shape[0]}.")

    return window.unsqueeze(0).to(device)  # Shape: (1, 5, C, H, W)
