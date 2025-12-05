from sqlalchemy.orm import Session

from .models import Task
from .schemas import TaskCreate
# -------------------- Create --------------------
def create_task(db: Session, task: TaskCreate):
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        deadline=task.deadline,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)  # get id and created_at
    return db_task
