from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


# Enum Values within MySQL
class StatusEnum(str, Enum):
    Pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


# BaseModel for tasks
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: StatusEnum
    deadline: datetime


# Used for Create requests
class TaskCreate(TaskBase):
    pass


# Used for responding to FrontEnd
class Task(TaskBase):
    id: int
    created_at: datetime

    # Allows for easier returns
    class Config:
        from_attributes = True
