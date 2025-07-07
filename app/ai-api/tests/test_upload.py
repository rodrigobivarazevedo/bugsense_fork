import os
import re
import requests

# Endpoint format
API_URL = "http://0.0.0.0:5001/ml_api/upload/?qr_data={qr_data}&storage=gcs"

dir_path = "../data/test_data/E.C_L_0014_top/"
qr_data = "user123456"

def send_image(image_path, qr_data):
    with open(image_path, "rb") as image_file:
        files = {
            "image": (os.path.basename(image_path), image_file, "image/png"),
        }
        response = requests.post(API_URL.format(qr_data=qr_data), files=files)

    print(f"Sent {image_path}")
    print("Status Code:", response.status_code)
    try:
        print("Response:", response.json())
    except Exception:
        print("Response content:", response.content)

if __name__ == "__main__":
    img_names = [
        img_name for img_name in os.listdir(dir_path) if img_name.endswith('.png')
    ]
    img_names.sort(
        key=lambda x: float(re.search(r'time([0-9\.]+)[._]', x).group(1))
    )

    images = [os.path.join(dir_path, f) for f in img_names]
    print(f"Found {len(images)} images in {dir_path}, sorted by time.")

    for image_path in images:
        send_image(image_path, qr_data)