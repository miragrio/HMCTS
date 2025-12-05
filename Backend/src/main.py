import uvicorn
from fastapi import FastAPI
from tasks.api import router as tasks_router

app = FastAPI()
app.include_router(tasks_router)

uvicorn.run(app, host="127.0.0.1", port=8000)
