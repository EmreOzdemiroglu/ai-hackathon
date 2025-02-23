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

class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category = Column(String, index=True)
    subcategory = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    
    # Relationship with Tutorial
    tutorials = relationship("Tutorial", back_populates="subject")

class Tutorial(Base):
    __tablename__ = "tutorials"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    title = Column(String, index=True)
    content = Column(Text)
    difficulty_level = Column(String)
    visual_aids = Column(Text)  # Store as JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    last_viewed_at = Column(DateTime, nullable=True)
    
    # Relationships
    subject = relationship("Subject", back_populates="tutorials")
    user_history = relationship("UserTutorialHistory", back_populates="tutorial")

class UserTutorialHistory(Base):
    __tablename__ = "user_tutorial_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tutorial_id = Column(Integer, ForeignKey("tutorials.id"))
    viewed_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="tutorial_history")
    tutorial = relationship("Tutorial", back_populates="user_history") 