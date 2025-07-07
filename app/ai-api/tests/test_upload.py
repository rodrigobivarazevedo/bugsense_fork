import os
import re
import requests


def send_image(image_path, qr_data):
    
    # Endpoint format
    API_URL = "http://0.0.0.0:5001/ml_api/upload/?qr_data={qr_data}&storage=gcs"

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
        
        
        
def load_images(dir_path):
    img_names = [
        img_name for img_name in os.listdir(dir_path) if img_name.endswith('.png')
    ]
    img_names.sort(
        key=lambda x: float(re.search(r'time([0-9\.]+)[._]', x).group(1))
    )

    images = [os.path.join(dir_path, f) for f in img_names]
    print(f"Found {len(images)} images in {dir_path}, sorted by time.")
    
    return images
    
    

if __name__ == "__main__":
    
    dir_path = "test_data/K.P_L_0050_top/"
    qr_data = "user1234567"
    
    images = load_images(dir_path)
    
    for image_path in images:
        send_image(image_path, qr_data)