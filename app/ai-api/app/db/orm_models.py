from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    test_strips = relationship('TestStrip', back_populates='user')


class TestStrip(Base):
    __tablename__ = 'test_strips'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    name = Column(String, nullable=False)
    description = Column(String)

    user = relationship('User', back_populates='test_strips')
    test_results = relationship('TestResult', back_populates='test_strip')


class TestResult(Base):
    __tablename__ = 'test_results'

    id = Column(Integer, primary_key=True, index=True)
    test_strip_id = Column(Integer, ForeignKey('test_strips.id'), nullable=False)
    date_tested = Column(DateTime, default=datetime.utcnow)
    prediction = Column(String, nullable=False)
    confidence = Column(Float)

    test_strip = relationship('TestStrip', back_populates='test_results')


class BacteriaSpecies(Base):
    __tablename__ = 'bacteria_species'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String)


class ModelPerformance(Base):
    __tablename__ = 'model_performance'

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String, nullable=False)
    version = Column(String, nullable=False)
    accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    f1_score = Column(Float)
    date_evaluated = Column(DateTime, default=datetime.now)


class PredictionHistory(Base):
    __tablename__ = 'prediction_history'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    test_result_id = Column(Integer, ForeignKey('test_results.id'), nullable=False)
    predicted_species = Column(String, nullable=False)
    actual_species = Column(String)
    confidence = Column(Float)
    date_predicted = Column(DateTime, default=datetime.now)

    user = relationship('User')
    test_result = relationship('TestResult')
