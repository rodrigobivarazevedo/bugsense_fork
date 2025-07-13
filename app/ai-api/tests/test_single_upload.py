import os
import re
import requests

# inside ai-api folder run python -m app.utils.create_token and make sure to have a venv running with jwt package

JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTI0NDIxODZ9.ct-5vNrAB8x8yBFK1tekzCTSgiy3XeU4uI6ca5Ixioc"  # Replace with your actual JWT token or generate it

HEADERS = {
    "Authorization": f"Bearer {JWT_TOKEN}"
}

def send_image(params, image_path, qr_data):
    API_URL = "http://0.0.0.0:5001/ml_api/upload/"
    
    try:
        with open(image_path, "rb") as image_file:
            files = {
                "image": (os.path.basename(image_path), image_file, "image/png"),
            }
            response = requests.post(API_URL, files=files, params=params)#, headers=HEADERS)
            response.raise_for_status()
    except requests.RequestException as e:
        print(f"Failed to send {image_path}: {e}")
        return

    print(f"Sent {image_path}")
    print("Status Code:", response.status_code)
        
    return response.json()


def get_time_from_filename(filename):
    match = re.search(r'time([0-9\.]+)[._]', filename)
    if match:
        return float(match.group(1))
    else:
        # Return 0 or raise error if no match found
        print(f"Warning: Could not extract time from filename '{filename}', defaulting to 0.")
        return 0.0


def load_images(dir_path):
    img_names = [
        img_name for img_name in os.listdir(dir_path) if img_name.endswith('.png')
    ]
    img_names.sort(key=get_time_from_filename)

    images = [os.path.join(dir_path, f) for f in img_names]
    print(f"Found {len(images)} images in {dir_path}, sorted by time.")

    return images


if __name__ == "__main__":

    data_users = [
        #("test_data/Ste_L_0036_top/", "user1"), # sterile, low concentration
        #("test_data/S.S_L_0023_top/", "test_user_demo_4"), # S.Saprophyticus, low concentration
        # ("test_data/S.A_L_0026_top/", "user3"), # S.Aureus, high concentration
        #("test_data/P.M_L_0052_top/", "test_user_demo_29"), # Ehormaechei, high concentration
        # ("test_data/P.A_L_0018_top/", "user5"), # P.Aeruginosa, low concentration
        ("test_data/K.P_L_0050_top/", "user6"), # K.Pneumoniae, high concentration
        # ("test_data/E.H_L_0059_top/", "user7"), # E.Hormaechei, high concentration 
        # ("test_data/E.F_L_0035_top/", "user8"), # E.Faecalis, high concentration
        #("test_data/E.C_L_0039_top/", "test_user_demo_3"), # E.Coli, high concentration
    ]
    
    
    print("LOCAL STORAGE")
    
    qr_data = "test_user_demo_38"
    
    params = {"qr_data": qr_data, "storage": "local"}
        
    dir_path = "test_data/K.P_L_0050_top/"
    images = load_images(dir_path)
    
    count = 0
    for image_path in images:
 
        response = send_image(params, image_path, qr_data)
        results = response.get('results', None)
        
        if results is not None:
            concentration = results.get('concentration', None)
            species = results.get('species', None) 
            print("---------------------------")
            print("PREDICTIONS")
            print("---------------------------")
            print("Number of images until prediction: ", count)
            print("species", species)
            print("concentration", concentration)
            break
        
        count += 1
        
    print("\n")
    print("---------------------------")
    print("TESTING WITH GOOGLE BUCKET")
    print("---------------------------")
    
    qr_data = "test_user_demo_37"
    
    params = {"qr_data": qr_data, "storage": "gcs"}
        
    dir_path = "test_data/K.P_L_0050_top/"
    images = load_images(dir_path)
    
    count = 0
    for image_path in images:
 
        response = send_image(params, image_path, qr_data)
        results = response.get('results', None)
        
        if results is not None:
            concentration = results.get('concentration', None)
            species = results.get('species', None) 
            print("---------------------------")
            print("PREDICTIONS")
            print("---------------------------")
            print("Number of images until prediction: ", count)
            print("species", species)
            print("concentration", concentration)
            break
        
        count += 1



