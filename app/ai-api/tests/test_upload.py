import requests

# Correct FastAPI server URL for the upload endpoint with user_id as a path parameter
API_URL = "http://0.0.0.0:5001/ml_api/upload/{user_id}?storage=local"

# Replace with the path to an image on your local system
dir_path = "../data/test_data/E.C_L_0001_bottom/"
user_id = "user123"

def send_image(image_path, user_id):
    with open(image_path, "rb") as image_file:
        files = {
            "image": (image_path, image_file, "image/png"),
        }
        response = requests.post(API_URL.format(user_id=user_id), files=files)
    print(f"Sent {image_path}")
    print("Status Code:", response.status_code)
    try:
        print("Response:", response.json())
    except Exception:
        print("Response content:", response.content)

if __name__ == "__main__":
    import os
    # get all the images in the folder
    images = [os.path.join(dir_path, f) for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
    print(f"Found {len(images)} images in {dir_path}.")
        
    for image_path in images:
        # send each image to the API
        send_image(image_path, user_id)
    
    
