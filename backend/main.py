from datetime import timedelta
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, Form, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models
import schemas
import auth
import chatbot
from database import engine, get_db
from typing import Optional
from fastapi.responses import JSONResponse
from chatbot import get_chat_response, UserProfile
from routes import subjects, cache

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
    expose_headers=["*"]
)

# Include routers
app.include_router(subjects.router, prefix="/api/subjects", tags=["subjects"])
app.include_router(cache.router, prefix="/api/cache", tags=["cache"])

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

@app.post("/api/chat/sessions")
async def create_session(
    title: str = "New Chat",
    user_id: str = Form("default_user")
):
    """Create a new chat session"""
    try:
        session = chatbot.create_chat_session(user_id, title)
        return session
    except Exception as e:
        print(f"Error creating session: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Failed to create session"}
        )

@app.get("/chat/history")
async def get_history(current_user: models.User = Depends(auth.get_current_user)):
    """Get all chat history for the current user"""
    history = chatbot.get_chat_history(str(current_user.id))
    return history

@app.post("/chat")
async def chat(
    message: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    try:
        # Get user's learning profile
        profile = db.query(models.LearningProfile).filter(
            models.LearningProfile.user_id == current_user.id
        ).first()

        # Convert profile to UserProfile if it exists
        user_profile = None
        if profile:
            user_profile = UserProfile(
                verbal_score=profile.verbal_score,
                non_verbal_score=profile.non_verbal_score,
                self_assessment=profile.self_assessment,
                age=profile.age
            )

        # Process image if provided
        image_data = None
        if image:
            image_data = await image.read()

        # Get response from chatbot
        response = await get_chat_response(
            user_query=message,
            user_profile=user_profile,
            image_data=image_data
        )

        return {"response": response if response else "I'm sorry, I couldn't generate a response."}
    except Exception as e:
        print(f"Chat error: {e}")  # Log the error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@app.delete("/chat/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: models.User = Depends(auth.get_current_user)
):
    """Delete a chat session"""
    success = chatbot.delete_chat_session(str(current_user.id), session_id)
    return {"status": "success" if success else "failed"}

@app.get("/signup/me", response_model=schemas.User)
def get_current_user_info(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 