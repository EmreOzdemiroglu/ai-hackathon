from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Relationship with LearningProfile
    learning_profile = relationship("LearningProfile", back_populates="user", uselist=False)

class LearningProfile(Base):
    __tablename__ = "learning_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    verbal_score = Column(Float)
    non_verbal_score = Column(Float)
    self_assessment = Column(Integer)  # Scale of 1-10
    age = Column(Integer)
    
    # Relationship with User
    user = relationship("User", back_populates="learning_profile") 