from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Database URL - localhost
DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/hmcts"

# SQLAlchemy Engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

# SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


# FastAPI dependancies
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
