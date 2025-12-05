from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .schemas import Task as TaskSchema
from .schemas import TaskCreate
from .service import create_task
from .database import get_db

router = APIRouter()

@router.post("/", response_model=TaskSchema)
def create_task_endpoint(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db, task)
