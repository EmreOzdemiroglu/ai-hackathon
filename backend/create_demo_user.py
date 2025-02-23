from sqlalchemy.orm import Session
from database import engine, get_db
import models
import auth
import schemas

def create_demo_user():
    db = Session(engine)
    
    # Check if demo user already exists
    demo_user = db.query(models.User).filter(models.User.username == "demo_user").first()
    if demo_user:
        print("Demo user already exists")
        return
    
    # Create demo user
    hashed_password = auth.get_password_hash("demo_password")
    demo_user = models.User(
        username="demo_user",
        email="demo@example.com",
        hashed_password=hashed_password
    )
    
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)
    print("Demo user created successfully")

if __name__ == "__main__":
    create_demo_user() 