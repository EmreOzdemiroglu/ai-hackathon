from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date

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

class Subject(BaseModel):
    id: int
    name: str
    category: str  # e.g., "Mathematics", "Physics", "Chemistry", "Biology"
    subcategory: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class TutorialBase(BaseModel):
    subject_id: int
    title: str
    content: str
    difficulty_level: str  # "Beginner", "Intermediate", "Advanced"
    visual_aids: List[dict]  # List of related visual resources (videos, images, etc.)

class TutorialCreate(TutorialBase):
    pass

class Tutorial(TutorialBase):
    id: int
    created_at: datetime
    last_viewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserTutorialHistory(BaseModel):
    id: int
    user_id: int
    tutorial_id: int
    viewed_at: datetime

    class Config:
        from_attributes = True

class TimeSpentRecord(BaseModel):
    id: int
    user_id: int
    date: date
    total_seconds: int
    hours: int
    minutes: int
    seconds: int

    class Config:
        from_attributes = True

class WeeklyTimeReport(BaseModel):
    days: List[TimeSpentRecord]
    total_hours: float

class SubjectCategoryScore(BaseModel):
    mathematics: float
    biology: float
    physics: float
    geometry: float
    chemistry: float

    class Config:
        from_attributes = True 