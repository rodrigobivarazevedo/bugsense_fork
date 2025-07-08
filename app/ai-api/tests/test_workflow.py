import requests
import time
import os

# CONFIGURATION
API_URL = "http://localhost:8000/upload/"
QR_DATA = "TEST_QR_123"
STORAGE = "local"  # or "gcs"
IMAGE_DIR = "test_images"  # Directory with test images (e.g., 6+ PNGs)
AUTH_TOKEN = "YOUR_JWT_TOKEN"  # Replace with a valid JWT token

HEADERS = {
    "Authorization": f"Bearer {AUTH_TOKEN}"
}

def upload_image(image_path, qr_data, storage="local"):
    with open(image_path, "rb") as img_file:
        files = {"image": (os.path.basename(image_path), img_file, "image/png")}
        data = {"qr_data": qr_data, "storage": storage}
        response = requests.post(API_URL, headers=HEADERS, files=files, data=data)
        print(f"Uploaded {image_path}: {response.status_code} {response.text}")
        return response

def main():
    image_files = sorted([os.path.join(IMAGE_DIR, f) for f in os.listdir(IMAGE_DIR) if f.endswith(".png")])
    print(f"Found {len(image_files)} images to upload.")

    # Upload images one by one, simulating time series
    for idx, img_path in enumerate(image_files):
        upload_image(img_path, QR_DATA, STORAGE)
        # Optionally, wait a bit between uploads to simulate real use
        time.sleep(1)

    print("All images uploaded. Wait a few seconds for backend processing...")
    time.sleep(5)

    # Optionally: Check Django backend for results (if you have a GET endpoint)
    # results_url = "http://<django-backend>/api/results/?qr_data=TEST_QR_123"
    # r = requests.get(results_url, headers={"X-ML-API-Key": "YOUR_API_KEY"})
    # print("Django backend results:", r.status_code, r.text)

if __name__ == "__main__":
    main() 