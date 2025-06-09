import requests

# Replace this with your actual FastAPI server URL
API_URL = "http://0.0.0.0:5001/ml_api/upload/user123456"

# Replace with the path to an image on your local system
image_path = "../data/test_data/E.C_L_0001_bottom/bac69_time0.0_ecoli.png"
user_id = "user123"

def send_image(image_path, user_id):
    with open(image_path, "rb") as image_file:
        files = {
            "image": (image_path, image_file, "image/png"),
        }
        data = {
            "user_id": user_id,
        }

        response = requests.post(API_URL, files=files, data=data)

    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    import os
    # get all the images in the folder
    dir_path = "../data/test_data/E.C_L_0001_bottom/"
    images = [os.path.join(dir_path, f) for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
    print(f"Found {len(images)} images in {image_path}.")
        
    for image_path in images:
        # send each image to the API
        send_image(image_path, user_id)
    
    
