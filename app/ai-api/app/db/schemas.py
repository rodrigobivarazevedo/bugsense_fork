from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserSchema(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

class PredictionSchema(BaseModel):
    id: int
    image_id: str
    label: str
    confidence: float
    predicted_at: datetime

    class Config:
        from_attributes = True

