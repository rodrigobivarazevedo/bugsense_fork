import requests

def get_user_prediction_species(qr_data, date=None):
    
    if date is None:
    
        API_URL = f"http://0.0.0.0:5001/ml_api/prediction/species/?qr_data={qr_data}&storage=gcs"
    
    else:
        API_URL = f"http://0.0.0.0:5001/ml_api/prediction/species/?qr_data={qr_data}&date={date}&storage=gcs"
 
    response = requests.get(API_URL)

    print("Status Code:", response.status_code)
    print("Response:", response.json())
    
def get_user_prediction_concentration(qr_data, date=None):
    
    if date is None:
    
        API_URL = f"http://0.0.0.0:5001/ml_api/prediction/concentration/?qr_data={qr_data}&storage=gcs"
        
    else:
        API_URL = f"http://0.0.0.0:5001/ml_api/prediction/concentration/?qr_data={qr_data}&date={date}&storage=gcs"
 
    response = requests.get(API_URL)

    print("Status Code:", response.status_code)
    print("Response:", response.json())

if __name__ == "__main__":
    qr_data = "user123456"
    
    # test for current date when there is available data
    get_user_prediction_species(qr_data)
    get_user_prediction_concentration(qr_data)
    
    # test for specific date
    date = "2025-07-06"
    get_user_prediction_species(qr_data, date)
    get_user_prediction_concentration(qr_data, date)
    
    
    
    
    
