from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.db.database import get_async_users_db
from app.core.security import get_current_active_user
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from fastapi.responses import JSONResponse
from app.ml_pipeline.inference import predict
from app.ml_pipeline.features import load_image_series_from_folder, prepare_input_tensor


router = APIRouter(prefix="/prediction", tags=["Prediction"])

@router.get(
    "/",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_prediction(
    request: Request,
    db: AsyncSession = Depends(get_async_users_db), 
):
    user = await get_current_active_user(request, db)
    
    if not user:
        raise HTTPException(status_code=403)
    
    user_id = user.uid
    
    try:
        
        current_date = datetime.now().strftime("%Y-%m-%d")
       
        folder_path =f"uploads/{user_id}/{current_date}/"
        
        image_series = load_image_series_from_folder(folder_path)
        window_input_tensor = prepare_input_tensor(image_series)

        result = predict(window_input_tensor, use_two_stage=True)

        print("First-tier predictions:", result["first_tier_preds"])
        print("First-tier labels:", result["first_tier_labels"])
        print("Second-tier predictions:", result["second_tier_preds"])
        print("Final predictions:", result["final_preds"])
        
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
    
