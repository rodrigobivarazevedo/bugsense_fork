from fastapi import APIRouter, HTTPException, status, Request, Query
from app.core.security import get_current_user
from datetime import datetime
from fastapi.responses import JSONResponse
from app.ml_pipeline.inference import predict
from app.ml_pipeline.features import load_image_series_from_folder, prepare_input_tensor
from app.core.config import secrets_manager

router = APIRouter(prefix="/prediction", tags=["Prediction"])

@router.get(
    "/species/",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_species_prediction(
    request: Request,
    qr_data: str = Query(...),
    storage: str = Query("local", enum=["local", "gcs"])
):
    #token = await get_current_user(request)
        
    try:
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        if storage == "local":
            folder_path =f"storage/uploads/{qr_data}/{current_date}/"
            image_series = load_image_series_from_folder(folder_path, cloud=False)
            
        elif storage == "gcs":
            bucket_name = secrets_manager.security_secrets.get("GCS_BUCKET_NAME")
            folder_path =f"gs://{bucket_name}/uploads/{qr_data}/{current_date}/"
            
            image_series = load_image_series_from_folder(folder_path, cloud=True)
        
        if image_series is None:
            response = {
                "message": "Not enough images to make a prediction.",
                "qr_data": qr_data,
                "date": current_date
            }

            return JSONResponse(content=response,
                        media_type="application/json", 
                        headers={"Content-Type": "application/json; charset=utf-8"}
                        )

        window_input_tensor = prepare_input_tensor(image_series, method="sliding_window")
        
        if window_input_tensor is None:
            response = {
                "message": "Not enouogh images to make a prediction.",
                "qr_data": qr_data,
                "date": current_date
            }

            return JSONResponse(content=response,
                        media_type="application/json", 
                        headers={"Content-Type": "application/json; charset=utf-8"}
                        )

        result = predict(window_input_tensor, use_two_stage=True)
        
        response = {
            "first_tier_preds": result["first_tier_preds"],
            "first_tier_labels": result["first_tier_labels"],
            "second_tier_preds": result["second_tier_preds"],
            "final_preds": result["final_preds"]
        }
        
        return JSONResponse(content=response,
                        media_type="application/json", 
                        headers={"Content-Type": "application/json; charset=utf-8"}
                        )
        
    except Exception as e:
       print(f"error {e}")
       #await db.rollback()
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    

@router.get(
    "/concentration",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_concentration_prediction(
    request: Request,
    qr_data: str = Query(...),
    storage: str = Query("local", enum=["local", "gcs"])
    
):
    
    token = get_current_user(request)
    
    try:
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        if storage == "local":
            folder_path =f"storage/uploads/{qr_data}/{current_date}/"
            
        elif storage == "gcs":
            folder_path =f"storage/uploads/{qr_data}/{current_date}/"
              
        image_series = load_image_series_from_folder(folder_path)
        
        if image_series is None:
            response = {
                "message": "Not enouogh images to make a prediction.",
                "qr_data": qr_data,
                "date": current_date
            }

            return JSONResponse(content=response,
                        media_type="application/json", 
                        headers={"Content-Type": "application/json; charset=utf-8"}
                        )

        image_input_tensor = prepare_input_tensor(image_series, method="image")
        
        if image_input_tensor is None:
            response = {
                "message": "Not enouogh images to make a prediction.",
                "qr_data": qr_data,
                "date": current_date
            }

            return JSONResponse(content=response,
                        media_type="application/json", 
                        headers={"Content-Type": "application/json; charset=utf-8"}
                        )

        result = predict(image_input_tensor, use_two_stage = True, task="concentration")
        
        response = {
            "final_preds": result
        }
        
        return JSONResponse(content=response,
                        media_type="application/json", 
                        headers={"Content-Type": "application/json; charset=utf-8"}
                        )
        
    except Exception as e:
       print(f"error {e}")
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    
