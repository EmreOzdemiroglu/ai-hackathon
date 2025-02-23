from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    # Relationship with LearningProfile and ChatMessage
    learning_profile = relationship("LearningProfile", back_populates="user", uselist=False)
    chat_messages = relationship("ChatMessage", back_populates="user")

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

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    response = Column(Text)
    planning_analysis = Column(Text)  # Store Planning Agent's analysis
    final_analysis = Column(Text)  # Store Analysis Agent's report
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship with User
    user = relationship("User", back_populates="chat_messages") 