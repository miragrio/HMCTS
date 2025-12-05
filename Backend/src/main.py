import uvicorn
from fastapi import FastAPI
from tasks.api import router as tasks_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(tasks_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for development you can allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

uvicorn.run(app, host="127.0.0.1", port=8000)
