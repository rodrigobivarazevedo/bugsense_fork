# models.py

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class Prediction(Base):
    __tablename__ = 'predictions'

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    predicted_at = Column(DateTime, default=datetime.now)

    image = relationship("Image", back_populates="predictions")


