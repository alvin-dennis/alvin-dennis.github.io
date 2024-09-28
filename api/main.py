import uvicorn
from database import SessionLocal, engine  # Import database session and engine
from fastapi import Depends, FastAPI, HTTPException
from models import Project, User
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Initialize FastAPI app
app = FastAPI()

# Create the database schema
User.metadata.create_all(bind=engine)
Project.metadata.create_all(bind=engine)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Pydantic models for input validation
class ProjectCreate(BaseModel):
    name: str
    user_id: int

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    name: str
    email: str

    class Config:
        orm_mode = True


# route to add a user
@app.post("/users/add/")
async def add_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(name=user.name, email=user.email)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": f"User '{user.name}' added with ID {new_user.id}"}


@app.get("/users/", response_model=list[UserCreate])
async def get_all_users(db: Session = Depends(get_db)):
    # Query all users from the database
    users = db.query(User).all()

    # Return the users directly; orm_mode will handle serialization
    return users


# route to add a project
@app.post("/projects/add/")
async def add_project(project: ProjectCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == project.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_project = Project(name=project.name, user_id=project.user_id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return {"message": f"Project '{project.name}' created for user '{user.name}'"}


# Run the FastAPI app
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
