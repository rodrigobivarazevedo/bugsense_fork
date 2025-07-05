import requests

def get_user_prediction(user_id):
    
    API_URL = f"http://0.0.0.0:5001/ml_api/prediction/?user_id={user_id}"
 
    response = requests.get(API_URL)

    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    user_id = "user123"
    get_user_prediction(user_id)
    
    
