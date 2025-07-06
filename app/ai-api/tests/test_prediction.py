import requests

def get_user_prediction(qr_data):
    
    API_URL = f"http://0.0.0.0:5001/ml_api/prediction/species/?qr_data={qr_data}&storage=gcs"
 
    response = requests.get(API_URL)

    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    qr_data = "user123456"
    get_user_prediction(qr_data)
    
    
