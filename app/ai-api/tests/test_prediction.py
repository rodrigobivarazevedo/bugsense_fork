import requests

# Replace this with your actual FastAPI server URL
API_URL = "http://0.0.0.0:5001/ml_api/prediction/user123456"

def get_user_prediction(user_id):
 

    response = requests.get(API_URL)

    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    user_id = "user123456"
    get_user_prediction(user_id)
    
    
