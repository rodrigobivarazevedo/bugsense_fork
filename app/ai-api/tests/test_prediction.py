import requests

def get_user_prediction_species(base_url, params, headers=None, date=None):
    if date:
        params["date"] = date

    response = requests.get(f"{base_url}/species/", params=params, headers=headers)
    print(f"Species prediction for {qr_data} (date={date}):")
    print("Status Code:", response.status_code)
    try:
        print("Response:", response.json())
    except Exception:
        print("Response content:", response.content)
    print()
    
    return response


def get_user_prediction_concentration(base_url, params, headers=None, date=None):
    if date:
        params["date"] = date

    response = requests.get(f"{base_url}/concentration/", params=params, headers=headers)
    print(f"Concentration prediction for {qr_data} (date={date}):")
    print("Status Code:", response.status_code)
    try:
        print("Response:", response.json())
    except Exception:
        print("Response content:", response.content)
    print()
    
    return response


if __name__ == "__main__":
    
    JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NTE5MDYyODR9.yehMu5KF3ocClcZ-cAOZ88xFJXgVgMnJvNqUvNU2ZWI"  # Replace with your actual JWT token or generate it

    HEADERS = {
        "Authorization": f"Bearer {JWT_TOKEN}"
    }
        
    BASE_URL = "http://0.0.0.0:5001/ml_api/prediction"
    
    qr_data = "test_user_demo_45"
    params = {"qr_data": qr_data, "storage": "local"}
    
    print("---------------------------")
    print("TESTING PREDICTION WITH LOCAL STORAGE")
    print("---------------------------")
    
    response_species = get_user_prediction_species(BASE_URL, params, HEADERS)
    response_concentration = get_user_prediction_concentration(BASE_URL, params, HEADERS)
    
    qr_data = "test_user_demo_44"
    params = {"qr_data": qr_data, "storage": "gcs"}
    
    print("---------------------------")
    print("TESTING PREDICTION WITH GOOGLE BUCKET")
    print("---------------------------")
    
    response_species = get_user_prediction_species(BASE_URL, params, HEADERS)
    response_concentration = get_user_prediction_concentration(BASE_URL, params, HEADERS)
    
    
    # BULK TESTING
    
    # data_users = [
    # ("test_data/Ste_L_0036_top/", "user1", "Sterile", "low"),          # Sterile, low concentration
    # ("test_data/S.S_L_0023_top/", "user2", "Ssaprophyticus", "low"),  # Ssaprophyticus, low concentration
    # ("test_data/S.A_L_0026_top/", "user3", "Saureus", "high"),        # Saureus, high concentration
    # ("test_data/P.M_L_0052_top/", "user4", "Pmirabilis", "high"),     # Pmirabilis, high concentration
    # ("test_data/P.A_L_0018_top/", "user5", "Paeruginosa", "low"),     # Paeruginosa, low concentration
    # ("test_data/K.P_L_0050_top/", "user6", "Kpneumoniae", "high"),    # Kpneumoniae, high concentration
    # ("test_data/E.H_L_0059_top/", "user7", "Ehormaechei", "high"),    # Ehormaechei, high concentration 
    # ("test_data/E.F_L_0035_top/", "user8", "Efaecalis", "high"),      # Efaecalis, high concentration
    # ("test_data/E.C_L_0039_top/", "user9", "Ecoli", "high"),          # Ecoli, high concentration
    # ]

    # correct_species = 0
    # correct_concentration = 0
    
    # # Test current/latest predictions without date for all users
    # for dir_path, user, species, concentration in data_users:
    #     response_species = get_user_prediction_species(user)
    #     response_concentration = get_user_prediction_concentration(user)
        
    #     # formats:  # {'confidence': 1.0, 'concentration': 'high'}
    #     # {'first_tier_preds': 4, 'first_tier_labels': 'Ecoli', 'second_tier_preds': 8, 'final_preds': 'Ecoli'}
        
    #     if response_species.json()['final_preds'] == species:
    #         correct_species += 1
            
    #     if response_concentration.json()['concentration'] == concentration:
    #         correct_concentration += 1
            
            
    # print("correct species", correct_species)
    # print("correct concentration", correct_concentration)
            

    # # Test predictions for a specific date with data
    # test_date = "2025-07-06"
    # for dir_path, qr_data, user, _, _ in data_users:
    #     get_user_prediction_species(user, test_date)
    #     get_user_prediction_concentration(user, test_date)

    # # Test predictions for a date without data
    # no_data_date = "2025-06-06"
    # for dir_path, qr_data, user, _, _ in data_users:
    #     get_user_prediction_species(user, no_data_date)
    #     get_user_prediction_concentration(user, no_data_date)
        
