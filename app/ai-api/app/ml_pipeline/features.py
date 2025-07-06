import os
import torch
from torchvision import transforms
from torchvision.transforms import InterpolationMode
from app.utils.stopping_point import find_stopping_point
from app.utils.upload import list_images_gcs, extract_timestamp
from PIL import Image
from io import BytesIO

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")


def load_image_from_source(source_path: str, gcs_blob=None):
    
    transform = transforms.Compose([
        transforms.CenterCrop((143, 40)),
        transforms.Resize((190, 40), interpolation=InterpolationMode.BICUBIC, antialias=True),
        transforms.ToTensor()
    ])
    
    if gcs_blob:
        image_bytes = gcs_blob.download_as_bytes()
        img = Image.open(BytesIO(image_bytes)).convert("RGB")
    else:
        img = Image.open(source_path).convert("RGB")
    return transform(img)


def load_image_series_from_folder(folder_path: str, cloud: bool = False, min_hours: int = 6) -> torch.Tensor:
    
    if cloud:
        # Extract bucket and prefix
        path = folder_path[5:]
        print("path", path)
        bucket_name, prefix = path.split("/", 1)
        img_entries = list_images_gcs(bucket_name, prefix)
    else:
        img_entries = [img for img in os.listdir(folder_path) if img.endswith(".png")]
        img_entries.sort(key=extract_timestamp)
       
    print(f"Found {len(img_entries)} images in {folder_path}.")

    min_index = (min_hours * 60) // 15
    if len(img_entries) <= min_index:
        print(f"Not enough images for {min_hours} hours (need >{min_index}, got {len(img_entries)}).")
        return None

    images = []
    if cloud:
        for blob in img_entries:
            img = load_image_from_source(None, gcs_blob=blob)
            images.append(img)
    else:
        for img_name in img_entries:
            img_path = os.path.join(folder_path, img_name)
            img = load_image_from_source(img_path)
            images.append(img)
            
            
    return torch.stack(images)


def prepare_input_tensor(images: torch.Tensor, method="sliding_window") -> torch.Tensor:
    """
    Prepares the input tensor for prediction.

    Args:
        images (torch.Tensor): A tensor of shape (T, C, H, W)
        method (str): Either 'sliding_window' or 'image'

    Returns:
        torch.Tensor or None: A tensor of shape (1, 5, C, H, W) for 'sliding_window',
                              or (1, C, H, W) for 'image', or None if not enough data.
    """
    stopping_point = find_stopping_point(images, threshold=23, mode="sliding_window")

    if stopping_point < 5:
        print("stoping point", stopping_point)
        print("No stopping point for prediction yet")
        return None

    if method == "sliding_window":
        start = max(stopping_point - 5, 0)
        end = stopping_point
        window = images[start:end]

        print(f"Window shape: {window.shape}, Start index: {start}, End index: {end}")
        if window.shape[0] != 5:
            raise ValueError(f"Window must have 5 frames, got {window.shape[0]}.")

        return window.unsqueeze(0).to(device)  # (1, 5, C, H, W)

    elif method == "image":
        image = images[stopping_point]  # (C, H, W)
        return image.unsqueeze(0).to(device)  # (1, C, H, W)

    else:
        raise ValueError(f"Unknown method: {method}")
