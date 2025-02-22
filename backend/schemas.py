from pydantic import BaseModel, EmailStr
from typing import Optional

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
        orm_mode = True

class UserWithProfile(User):
    learning_profile: Optional[LearningProfile] = None

    class Config:
        orm_mode = True 