from fastapi import APIRouter, HTTPException, status, Request, Query
from app.core.security import get_current_user
from datetime import datetime
from fastapi.responses import JSONResponse
from app.ml_pipeline.inference import predict
from app.ml_pipeline.features import load_image_series_from_folder, prepare_input_tensor
from app.core.config import secrets_manager
from typing import Optional

router = APIRouter(prefix="/prediction", tags=["Prediction"])

# Helper functions for direct calls (without FastAPI dependencies)
async def predict_species_core(qr_data: str, storage: str = "local", date: Optional[str] = None):
    """Core species prediction logic without FastAPI dependencies"""
    try:
        if date:
            try:
                parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
                input_date = parsed_date.strftime("%Y-%m-%d")
            except ValueError:
                raise ValueError("Invalid date format. Expected format: YYYY-MM-DD.")
        else:
            input_date = datetime.now().strftime("%Y-%m-%d")
        
        if not qr_data:
            raise ValueError("No qr code provided")
                    
        if storage == "local":
            folder_path = f"storage/uploads/{qr_data}/{input_date}/"
            image_series = load_image_series_from_folder(folder_path, cloud=False)
            
        elif storage == "gcs":
            bucket_name = secrets_manager.security_secrets.get("GCS_BUCKET_NAME")
            folder_path = f"gs://{bucket_name}/uploads/{qr_data}/{input_date}/"
            image_series = load_image_series_from_folder(folder_path, cloud=True)
        
        if image_series is None:
            return {
                "message": "Not enough images to make a prediction.",
                "qr_data": qr_data,
                "date": input_date,
                "species": None
            }

        window_input_tensor = prepare_input_tensor(image_series, method="sliding_window")
        
        if window_input_tensor is None:
            return {
                "message": "Not enough images to make a prediction.",
                "qr_data": qr_data,
                "date": input_date,
                "species": None
            }

        result = predict(window_input_tensor, task="species", use_two_stage=True)
        
        species = result.get("final_preds")
        
        return {
            "first_tier_preds": result.get("first_tier_preds"),
            "first_tier_labels": result.get("first_tier_labels"),
            "second_tier_preds": result.get("second_tier_preds"),
            "message": "Prediction successful",
            "qr_data": qr_data,
            "date": input_date,
            "species": species if species else None
        }
        
    except Exception as e:
        print(f"Species prediction error: {e}")
        raise

async def predict_concentration_core(qr_data: str, storage: str = "local", date: Optional[str] = None):
    """Core concentration prediction logic without FastAPI dependencies"""
    try:
        if date:
            try:
                parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
                input_date = parsed_date.strftime("%Y-%m-%d")
            except ValueError:
                raise ValueError("Invalid date format. Expected format: YYYY-MM-DD.")
        else:
            input_date = datetime.now().strftime("%Y-%m-%d")
        
        if not qr_data:
            raise ValueError("No qr code provided")
                    
        if storage == "local":
            folder_path = f"storage/uploads/{qr_data}/{input_date}/"
            image_series = load_image_series_from_folder(folder_path, cloud=False)
            
        elif storage == "gcs":
            bucket_name = secrets_manager.security_secrets.get("GCS_BUCKET_NAME")
            folder_path = f"gs://{bucket_name}/uploads/{qr_data}/{input_date}/"
            image_series = load_image_series_from_folder(folder_path, cloud=True)
        
        if image_series is None:
            return {
                "message": "Not enough images to make a prediction.",
                "qr_data": qr_data,
                "date": input_date,
                "confidence": None,
                "concentration": None,
            }

        image_input_tensor = prepare_input_tensor(image_series, method="image")
        
        if image_input_tensor is None:
            return {
                "message": "Not enough images to make a prediction.",
                "qr_data": qr_data,
                "date": input_date,
                "confidence": None,
                "concentration": None,
            }

        result = predict(image_input_tensor, task="concentration")
        
        confidence = result.get("confidence")
        concentration = result.get("concentration")

        return {
            "message": "Prediction successful",
            "qr_data": qr_data,
            "date": input_date,
            "confidence": confidence,
            "concentration": concentration if concentration else None,
        }
        
    except Exception as e:
        print(f"Concentration prediction error: {e}")
        raise

# FastAPI route handlers (keep existing code)
@router.get(
    "/species/",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_species_prediction(
    request: Request,
    qr_data: str = Query(...),
    date: Optional[str] = Query(None, description="Format: YYYY-MM-DD"), 
    storage: Optional[str] = Query("local", enum=["local", "gcs"])
):
    
    #token = await get_current_user(request)
    
    try:
        result = await predict_species_core(qr_data, storage, date)
        return JSONResponse(content=result,
                    media_type="application/json", 
                    headers={"Content-Type": "application/json; charset=utf-8"}
                    )
        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
       print(f"error {e}")
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
   
   

@router.get(
    "/concentration/",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_concentration_prediction(
    request: Request,
    qr_data: str = Query(...),
    date: Optional[str] = Query(None, description="Format: YYYY-MM-DD"), 
    storage: Optional[str] = Query("local", enum=["local", "gcs"])
):
    #token = await get_current_user(request)

    try:
        result = await predict_concentration_core(qr_data, storage, date)
        return JSONResponse(content=result,
                    media_type="application/json", 
                    headers={"Content-Type": "application/json; charset=utf-8"}
                    )
        
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
       print(f"error {e}")
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    
