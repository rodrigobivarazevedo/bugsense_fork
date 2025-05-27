from fastapi import APIRouter, Depends, HTTPException, status, Request
from app.db.database import get_async_users_db
from app.core.security import get_current_active_user, get_api_key
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi.responses import JSONResponse
from app.db.orm_models import Prediction
from app.db.schemas import PredictionHistorySchema

router = APIRouter(prefix="/predictions", tags=["Prediction"])

@router.get(
    "/",
    summary="Retrieve user's prediction history",
    status_code=status.HTTP_200_OK,
)
async def get_predictions(
    request: Request,
    db: AsyncSession = Depends(get_async_users_db), 
):
    user = await get_current_active_user(request, db)
    
    if not user:
        raise HTTPException(status_code=403)
    
    user_id = user.uid
    
    try:
       
        # get the last prediction
        result = await db.execute(
            select(Prediction)
            .filter( Prediction.userId == user_id)
            .order_by( Prediction.date.desc())
            .limit(1)
        )
        predictions = result.scalars().all()
                
        if not predictions:
            return JSONResponse(
                content=[],
                media_type="application/json",
                headers={"Content-Type": "application/json; charset=utf-8"}
            )
            
        validated_predictions = [PredictionHistorySchema(**prediction.__dict__).model_dump(mode="json") for prediction in predictions]
                
        return JSONResponse(content=validated_predictions,
                        media_type="application/json", 
                        headers={"Content-Type": "application/json; charset=utf-8"}
                        )
        
    except Exception as e:
        print(f"error {e}")
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    
