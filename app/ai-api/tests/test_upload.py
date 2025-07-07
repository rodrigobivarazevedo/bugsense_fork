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
         
    data_users = [
    ("test_data/Ste_L_0036_top/", "user1"),
    ("test_data/S.S_L_0023_top/", "user2"),
    ("test_data/S.A_L_0026_top/", "user3"),
    ("test_data/P.M_L_0052_top/", "user4"),
    ("test_data/P.A_L_0018_top/", "user5"),
    ("test_data/K.P_L_0050_top/", "user6"),
    ("test_data/E.H_L_0059_top/", "user7"),
    ("test_data/E.F_L_0035_top/", "user8"),
    ("test_data/E.C_L_0039_top/", "user9"),
    ("test_data/E.C_L_0039_top/", "user10"),
    ]

    for dir_path, qr_data in data_users:
        images = load_images(dir_path)
        for image_path in images:
            send_image(image_path, qr_data)

        
        
  