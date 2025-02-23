from datetime import timedelta, datetime, date
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import auth
import chatbot
from database import engine, get_db
import json
from typing import List, Optional
import google.generativeai as genai
import re

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock subjects
with open("subjects.json") as f:
    MOCK_SUBJECTS = json.load(f)

# Configure Gemini
genai.configure(api_key='YOUR_GEMINI_API_KEY')
model = genai.GenerativeModel('gemini-2.0-flash')

@app.post("/signup", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if email exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Find user by username
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/assessment/profile", response_model=schemas.LearningProfile)
def create_learning_profile(
    profile: schemas.LearningProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Check if profile already exists
    existing_profile = db.query(models.LearningProfile).filter(
        models.LearningProfile.user_id == current_user.id
    ).first()
    
    if existing_profile:
        raise HTTPException(status_code=400, detail="Learning profile already exists")
    
    db_profile = models.LearningProfile(
        **profile.dict(),
        user_id=current_user.id
    )
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    return db_profile

@app.get("/assessment/profile", response_model=schemas.LearningProfile)
def get_learning_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    profile = db.query(models.LearningProfile).filter(
        models.LearningProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Learning profile not found")
    return profile

@app.put("/assessment/profile", response_model=schemas.LearningProfile)
def update_learning_profile(
    profile_update: schemas.LearningProfileCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    existing_profile = db.query(models.LearningProfile).filter(
        models.LearningProfile.user_id == current_user.id
    ).first()
    
    if not existing_profile:
        raise HTTPException(status_code=404, detail="Learning profile not found")
    
    for key, value in profile_update.dict(exclude_unset=True).items():
        setattr(existing_profile, key, value)
    
    db.commit()
    db.refresh(existing_profile)
    return existing_profile

@app.delete("/assessment/profile", response_model=dict)
def delete_learning_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    profile = db.query(models.LearningProfile).filter(
        models.LearningProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Learning profile not found")
    
    db.delete(profile)
    db.commit()
    return {"message": "Learning profile deleted successfully"}

@app.post("/chat", response_model=schemas.ChatMessageResponse)
async def create_chat_message(
    message: schemas.ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    Process a chat message through the Planning and Analysis agents
    and store the results in the database
    """
    # Get response from chatbot
    planning_analysis, final_analysis, response = await chatbot.get_chat_response(message.content)
    
    # Create chat message
    db_message = models.ChatMessage(
        user_id=current_user.id,
        content=message.content,
        response=response,
        planning_analysis=planning_analysis,
        final_analysis=final_analysis
    )
    
    # Save to database
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return db_message

@app.get("/chat/history", response_model=list[schemas.ChatMessageResponse])
async def get_chat_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """Get chat history for the current user"""
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).order_by(models.ChatMessage.created_at.desc()).all()
    return messages

@app.get("/subjects", response_model=List[schemas.Subject])
def get_subjects(
    search: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Subject)
    
    if search:
        query = query.filter(models.Subject.name.ilike(f"%{search}%"))
    if category:
        query = query.filter(models.Subject.category == category)
    
    return query.all()

@app.get("/subjects/{subject_id}/tutorial", response_model=schemas.Tutorial)
async def get_tutorial(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get subject
    subject = db.query(models.Subject).filter(models.Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    
    # Check if tutorial exists
    tutorial = db.query(models.Tutorial).filter(models.Tutorial.subject_id == subject_id).first()
    
    if not tutorial:
        # Generate tutorial content using AI
        prompt = f"Create a detailed tutorial about {subject.name}. Include key concepts, examples, and explanations."
        response = await model.generate_content(prompt)
        content = response.text
        
        # Generate visual aids using Gemini
        visual_prompt = f"Find educational resources for {subject.name}. Include YouTube videos, interactive websites, and visual aids."
        visual_response = await model.generate_content(visual_prompt)
        visual_aids = visual_response.text
        
        # Create new tutorial
        tutorial = models.Tutorial(
            subject_id=subject_id,
            title=f"Tutorial: {subject.name}",
            content=content,
            difficulty_level="Intermediate",
            visual_aids=json.dumps({"resources": visual_aids})
        )
        db.add(tutorial)
        db.commit()
        db.refresh(tutorial)
    
    # Record view history
    history = models.UserTutorialHistory(
        user_id=current_user.id,
        tutorial_id=tutorial.id
    )
    db.add(history)
    
    # Update last viewed timestamp
    tutorial.last_viewed_at = datetime.utcnow()
    db.commit()
    
    return tutorial

@app.get("/user/tutorial-history", response_model=List[schemas.Tutorial])
def get_user_tutorial_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    history = db.query(models.Tutorial).\
        join(models.UserTutorialHistory).\
        filter(models.UserTutorialHistory.user_id == current_user.id).\
        order_by(models.UserTutorialHistory.viewed_at.desc()).\
        all()
    
    return history

@app.post("/pomodoro/active", response_model=schemas.TimeSpentRecord)
async def update_active_time(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get or create today's time record
    today = datetime.utcnow().date()
    time_record = db.query(models.TimeSpentRecord).filter(
        models.TimeSpentRecord.user_id == current_user.id,
        models.TimeSpentRecord.date == today
    ).first()
    
    if not time_record:
        time_record = models.TimeSpentRecord(
            user_id=current_user.id,
            date=today,
            total_seconds=0
        )
        db.add(time_record)
    
    # Add 30 seconds to total time
    time_record.total_seconds += 30
    
    # Calculate hours, minutes, seconds
    hours = time_record.total_seconds // 3600
    minutes = (time_record.total_seconds % 3600) // 60
    seconds = time_record.total_seconds % 60
    
    db.commit()
    db.refresh(time_record)
    
    return schemas.TimeSpentRecord(
        id=time_record.id,
        user_id=time_record.user_id,
        date=time_record.date,
        total_seconds=time_record.total_seconds,
        hours=hours,
        minutes=minutes,
        seconds=seconds
    )

@app.get("/time-spent/weekly", response_model=schemas.WeeklyTimeReport)
async def get_weekly_time_report(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Calculate date range for the past week
    end_date = datetime.utcnow().date()
    start_date = end_date - timedelta(days=6)
    
    # Get records for the past week
    records = db.query(models.TimeSpentRecord).filter(
        models.TimeSpentRecord.user_id == current_user.id,
        models.TimeSpentRecord.date >= start_date,
        models.TimeSpentRecord.date <= end_date
    ).all()
    
    # Process records
    days = []
    total_seconds = 0
    
    for record in records:
        total_seconds += record.total_seconds
        hours = record.total_seconds // 3600
        minutes = (record.total_seconds % 3600) // 60
        seconds = record.total_seconds % 60
        
        days.append(schemas.TimeSpentRecord(
            id=record.id,
            user_id=record.user_id,
            date=record.date,
            total_seconds=record.total_seconds,
            hours=hours,
            minutes=minutes,
            seconds=seconds
        ))
    
    return schemas.WeeklyTimeReport(
        days=days,
        total_hours=round(total_seconds / 3600, 2)
    )

@app.get("/user/subject-analysis", response_model=schemas.SubjectCategoryScore)
async def analyze_subject_interests(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Get latest 100 chat messages
    messages = db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id
    ).order_by(models.ChatMessage.created_at.desc()).limit(100).all()
    
    if not messages:
        return schemas.SubjectCategoryScore(
            mathematics=20.0,
            biology=20.0,
            physics=20.0,
            geometry=20.0,
            chemistry=20.0
        )
    
    # Prepare chat history for analysis
    chat_history = "\n".join([
        f"User: {msg.content}\nResponse: {msg.response}"
        for msg in messages
    ])
    
    # Create prompt for Gemini
    prompt = """Analyze the following chat history and classify the content into these categories:
    - Mathematics
    - Biology
    - Physics
    - Geometry
    - Chemistry

    Provide ONLY the percentage distribution (adding up to 100%) in this exact format:
    Mathematics: X%
    Biology: X%
    Physics: X%
    Geometry: X%
    Chemistry: X%

    Chat History:
    """ + chat_history
    
    # Get analysis from Gemini
    response = await model.generate_content(prompt)
    analysis_text = response.text
    
    # Parse percentages using regex
    pattern = r"(\w+):\s*(\d+(?:\.\d+)?)%"
    matches = re.findall(pattern, analysis_text)
    
    # Convert to dictionary
    scores = {}
    for category, percentage in matches:
        scores[category.lower()] = float(percentage)
    
    # Ensure all categories are present with at least 0%
    default_categories = {
        "mathematics": 0.0,
        "biology": 0.0,
        "physics": 0.0,
        "geometry": 0.0,
        "chemistry": 0.0
    }
    default_categories.update(scores)
    
    return schemas.SubjectCategoryScore(**default_categories) 