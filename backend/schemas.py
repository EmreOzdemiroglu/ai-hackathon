from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class LearningProfileBase(BaseModel):
    verbal_score: Optional[float] = None
    non_verbal_score: Optional[float] = None
    self_assessment: Optional[int] = None
    age: Optional[int] = None

class LearningProfileCreate(LearningProfileBase):
    pass

class LearningProfile(LearningProfileBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class ChatMessageBase(BaseModel):
    content: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: int
    user_id: int
    response: str
    planning_analysis: str
    final_analysis: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserWithProfile(User):
    learning_profile: Optional[LearningProfile] = None
    chat_messages: List[ChatMessageResponse] = []

    class Config:
        from_attributes = True 