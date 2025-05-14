from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserSchema(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_active: bool

    class Config:
        from_attributes = True

class TestStripSchema(BaseModel):
    id: int
    user_id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class TestResultSchema(BaseModel):
    id: int
    test_strip_id: int
    date_tested: datetime
    prediction: str
    confidence: float

    class Config:
        from_attributes = True


class BacteriaSpeciesSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    class Config:
        from_attributes = True


class ModelPerformanceSchema(BaseModel):
    id: int
    model_name: str
    version: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    date_evaluated: datetime

    class Config:
        from_attributes = True


class PredictionHistorySchema(BaseModel):
    id: int
    user_id: int
    test_result_id: int
    predicted_species: str
    actual_species: Optional[str] = None
    confidence: float
    date_predicted: datetime

    class Config:
        from_attributes = True


class TokenData(BaseModel):
    uid: int
    scope: str
    
    class Config:
        from_attributes = True