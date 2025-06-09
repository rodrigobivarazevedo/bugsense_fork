from torchvision import transforms
from PIL import Image
import os
import torch
from torchvision.transforms import InterpolationMode
import numpy as np
from datetime import datetime
from skimage.color import rgb2lab

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def get_sorted_images_by_timestamp(folder_path: str) -> list:
    """
    Loads and returns all image filenames in the folder,
    sorted by timestamp embedded in the filename: HH-MM-SS-ffffff.png
    """
    img_names = [img for img in os.listdir(folder_path) if img.endswith(".png")]

    def extract_timestamp(filename):
        # Remove extension, assume filename is like HH-MM-SS-ffffff
        base = os.path.splitext(filename)[0]
        try:
            # Parse to datetime for robust sorting
            return datetime.strptime(base, "%H-%M-%S-%f")
        except ValueError:
            return datetime.min  # Put malformed filenames at the beginning

    img_names.sort(key=extract_timestamp)
    return img_names


# Center crop to make sure dark artifacts are removed
# Resize for computational efficiency (can be adjusted)
 # Convert to tensor for cuda
transform = transforms.Compose([
            transforms.CenterCrop((143, 40)),                                                          
            transforms.Resize((190, 40),interpolation=InterpolationMode.BICUBIC, antialias=True),       
            transforms.ToTensor()                                                                       
        ])

def load_image_series_from_folder(folder_path: str,  min_hours: int = 6) -> torch.Tensor:
    img_names = get_sorted_images_by_timestamp(folder_path)

    print(f"Found {len(img_names)} images in {folder_path}.")
    
    min_index = (min_hours * 60) // 15  # 15 minutes per image
    if len(img_names) <= min_index:
        print(f"Not enough images for {min_hours} hours (need >{min_index}, got {len(img_names)}).")
        return None

    images = []
    for img_name in img_names:
        img_path = os.path.join(folder_path, img_name)
        img = Image.open(img_path).convert("RGB")
        img = transform(img)
        images.append(img)

    images = torch.stack(images)
    return images


def find_stopping_point(image_tensor, threshold, mode = "sliding_window", use_roi_size=10, use_stride_size=5, use_prev_image=None):
    for index in range(len(image_tensor)):
        image = image_tensor[index]
        image = image.permute(1, 2, 0).numpy()
        image = rgb2lab(image)
        if index == 0:
            prev_image = image
            continue
        
        roi_size = use_roi_size

        if mode == "sliding_window":
            stride = use_stride_size
            h, w = image.shape[:2]
            for i in range(0, h-roi_size+1, stride):
                for j in range(0, w-roi_size+1, stride):
                    roi_current = image[i:i+roi_size, j:j+roi_size]
                    roi_prev = prev_image[i:i+roi_size, j:j+roi_size]
                    delta_E = np.sqrt(np.sum((roi_current - roi_prev) ** 2, axis=2))
                    roi_mean_delta_E = np.mean(delta_E)
                    if roi_mean_delta_E > threshold:
                        return index
                    
                # if None we are always comparing to the first image to find the stopping point
                if use_prev_image:
                    prev_image = image
            
        elif mode == "random":
            for i in range(0, 50):
                i = np.random.randint(0, image.shape[0]- roi_size)
                j = np.random.randint(0, image.shape[1] - roi_size)
                roi_current = image[i:i+roi_size, j:j+roi_size]
                roi_prev = prev_image[i:i+roi_size, j:j+roi_size]
                delta_E = np.sqrt(np.sum((roi_current - roi_prev) ** 2, axis=2))
                roi_mean_delta_E = np.mean(delta_E)
                if roi_mean_delta_E < threshold:
                    return index
    return index


def prepare_input_tensor(images: torch.Tensor) -> torch.Tensor:    
    # Find the stopping point
    # compare each image with the first image in the series
    # and find the first image where the difference exceeds a threshold.
    
    # Example image series sampled each 15 minutes:
    # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, stoping_point(10), 11, 12, ..., 80]
    # first window      [6, 7, 8, 9, 10] 
    # second window        [7, 8, 9, 10, 11]
    # third window             [8, 9, 10, 11, 12]
    # fourth window               [9, 10, 11, 12, 13]
    # fifth window                   [10, 11, 12, 13, 14]
    
    # Prediction window:
    # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, stoping_point(10), 11, 12, ..., 80]
    # first window      [6, 7, 8, 9, 10] → only before and including stopping point (10)
    
    # comparing to first image in the series -> threshold=23
    # comparing to previous image in the series -> threshold=10
    
    stopping_point = find_stopping_point(images, threshold=23, mode="sliding_window")
    
    print(f"Stopping point found at frame index: {stopping_point}")
    
    # use the last index of the image series as stopping point

    stopping_point = len(images) - 1
    print(f"Stopping point adjusted to last frame index: {stopping_point}")

    # Slice last 5 frames ending at the stopping point
    start = max(stopping_point - 5, 0)
    end = stopping_point if stopping_point > 5 else 5
    
    if stopping_point < 5:  
        print("No stopping point for prediction yet")
        return None
        
    window = images[start:end]
    
    print(f"Window shape: {window.shape}, Start index: {start}, End index: {end}")
    
    if window.shape[0] != 5:
        raise ValueError(f"Window must have 5 frames, got {window.shape[0]}.")

    window = window.unsqueeze(0).to(device)  # Shape: (1, 5, C, H, W)
    return window

