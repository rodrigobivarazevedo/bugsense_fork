from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from app.db.database import get_async_users_db
from app.core.security import get_current_active_user
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from fastapi.responses import JSONResponse
from app.ml_pipeline.inference import predict
from app.ml_pipeline.features import load_image_series_from_folder, prepare_input_tensor


router = APIRouter(prefix="/prediction", tags=["Prediction"])

UPLOAD_DIR = "storage/uploads"  # Directory to store uploaded images

@router.get(
    "/species",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_species_prediction(
    request: Request,
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_async_users_db), 
    
):
    try:
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        folder_path =f"{UPLOAD_DIR}/{user_id}/{current_date}/"
        
        image_series = load_image_series_from_folder(folder_path)
        
        if image_series is None:
            response = {
                "message": "Not enouogh images to make a prediction.",
                "user_id": user_id,
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
                "user_id": user_id,
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
       await db.rollback()
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    

@router.get(
    "/concentration",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_concentration_prediction(
    request: Request,
    user_id: str = Query(...),
    db: AsyncSession = Depends(get_async_users_db), 
    
):
    try:
        current_date = datetime.now().strftime("%Y-%m-%d")
        
        folder_path =f"{UPLOAD_DIR}/{user_id}/{current_date}/"
        
        image_series = load_image_series_from_folder(folder_path)
        
        if image_series is None:
            response = {
                "message": "Not enouogh images to make a prediction.",
                "user_id": user_id,
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
                "user_id": user_id,
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
       await db.rollback()
       raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    
