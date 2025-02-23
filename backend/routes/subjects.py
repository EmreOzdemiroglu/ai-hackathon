from fastapi import APIRouter, HTTPException
import json
from typing import List, Dict

router = APIRouter()

def load_subjects():
    with open('subjects.json', 'r') as f:
        data = json.load(f)
        return data.get('subjects', [])

@router.get("/categories")
def get_categories() -> List[str]:
    subjects = load_subjects()
    # Get unique categories
    categories = list(set(subject['category'] for subject in subjects))
    return sorted(categories)

@router.get("/subcategories/{category}")
def get_subcategories(category: str) -> List[str]:
    subjects = load_subjects()
    # Get unique subcategories for the given category
    subcategories = list(set(
        subject['subcategory'] 
        for subject in subjects 
        if subject['category'] == category
    ))
    if not subcategories:
        raise HTTPException(status_code=404, detail=f"No subcategories found for category: {category}")
    return sorted(subcategories) 