from fastapi import APIRouter, HTTPException, Body
import json
from typing import Dict, Optional
import os
from pydantic import BaseModel

router = APIRouter()

# In-memory cache
_cache: Dict[str, str] = {}

# Cache file path
CACHE_FILE = "subject_cache.json"

class ExplanationBody(BaseModel):
    explanation: str

def load_cache():
    """Load cache from file if it exists"""
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            global _cache
            _cache = json.load(f)

def save_cache():
    """Save cache to file"""
    with open(CACHE_FILE, 'w') as f:
        json.dump(_cache, f)

# Load cache on startup
load_cache()

@router.get("/explanation/{subcategory}")
async def get_cached_explanation(subcategory: str) -> Dict[str, Optional[str]]:
    """Get cached explanation for a subcategory"""
    if subcategory in _cache:
        return {"explanation": _cache[subcategory]}
    return {"explanation": None}

@router.post("/explanation/{subcategory}")
async def cache_explanation(subcategory: str, body: ExplanationBody):
    """Cache explanation for a subcategory"""
    _cache[subcategory] = body.explanation
    save_cache()
    return {"status": "success"} 