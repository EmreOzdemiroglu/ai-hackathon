from fastapi import FastAPI, HTTPException, UploadFile, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
import chatbot

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
class MessageResponse(BaseModel):
    content: str
    role: str
    timestamp: datetime
    image_url: Optional[str] = None

class ChatSessionResponse(BaseModel):
    id: str
    title: str
    messages: List[MessageResponse]
    created_at: datetime
    updated_at: datetime

class ChatHistoryResponse(BaseModel):
    sessions: List[ChatSessionResponse]
    user_id: str

# Mock authentication - Replace with proper auth in production
async def get_current_user():
    return "test_user"  # Replace with actual user authentication

@app.post("/chat/sessions")
async def create_session(
    title: str = "New Chat",
    current_user: str = Depends(get_current_user)
):
    """Create a new chat session"""
    session = chatbot.create_chat_session(current_user, title)
    return ChatSessionResponse(**session.dict())

@app.get("/chat/history")
async def get_history(current_user: str = Depends(get_current_user)):
    """Get all chat history for the current user"""
    history = chatbot.get_chat_history(current_user)
    return ChatHistoryResponse(**history.dict())

@app.post("/chat/{session_id}/messages")
async def send_message(
    session_id: str,
    content: str = Form(...),
    image: Optional[UploadFile] = None,
    current_user: str = Depends(get_current_user)
):
    """Send a message in a chat session"""
    try:
        image_data = await image.read() if image else None
        planning_analysis, final_analysis, response = await chatbot.get_chat_response(
            current_user,
            session_id,
            content,
            image_data
        )
        
        # Get updated session
        history = chatbot.get_chat_history(current_user)
        session = next((s for s in history.sessions if s.id == session_id), None)
        
        if not session:
            raise HTTPException(status_code=404, message="Session not found")
            
        return {
            "session": ChatSessionResponse(**session.dict()),
            "planning_analysis": planning_analysis,
            "final_analysis": final_analysis
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/chat/sessions/{session_id}")
async def delete_session(
    session_id: str,
    current_user: str = Depends(get_current_user)
):
    """Delete a chat session"""
    history = chatbot.get_chat_history(current_user)
    history.sessions = [s for s in history.sessions if s.id != session_id]
    return {"status": "success"} 