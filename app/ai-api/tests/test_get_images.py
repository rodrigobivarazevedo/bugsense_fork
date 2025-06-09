import requests
from datetime import datetime

def get_user_image_paths(user_id):
    
    current_date = datetime.now().strftime("%Y-%m-%d")
    
    API_URL = f"http://0.0.0.0:5001/ml_api/uploads/?user_id={user_id}&date={current_date}"
 
    response = requests.get(API_URL)

    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    user_id = "user123456"
    #user_id = "user123"
    get_user_image_paths(user_id)
    
    
