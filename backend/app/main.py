from dotenv import load_dotenv
from pathlib import Path
import os
from datetime import date

# Load .env
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

print("GROQ =", os.getenv("GROQ_API_KEY"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, SessionLocal
from app.models import Base
from app import models

from app.routers import users
from app.routers import tasks
from app.routers import login
from app.routers import chatbot

app = FastAPI(
    title="Task Management API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


def seed_demo_data() -> None:
    db = SessionLocal()

    try:
        venesa = (
            db.query(models.User)
            .filter(models.User.username == "venesa")
            .first()
        )

        if not venesa:
            venesa = models.User(
                name="Venesa Hutajulu",
                username="venesa",
                password="123456",
            )
            db.add(venesa)
            db.commit()
            db.refresh(venesa)

        if db.query(models.User).count() < 3:
            existing_usernames = {
                user.username for user in db.query(models.User).all()
            }

            extra_users = []

            if "alya" not in existing_usernames:
                extra_users.append(
                    models.User(
                        name="Alya Putri",
                        username="alya",
                        password="alya123",
                    )
                )

            if "rizky" not in existing_usernames:
                extra_users.append(
                    models.User(
                        name="Rizky Pratama",
                        username="rizky",
                        password="rizky123",
                    )
                )

            if extra_users:
                db.add_all(extra_users)
                db.commit()

        if db.query(models.Task).count() == 0:
            users_by_username = {
                user.username: user
                for user in db.query(models.User).all()
            }

            db.add_all(
                [
                    models.Task(
                        title="Build task dashboard",
                        description="Create a polished overview page with task metrics.",
                        status="In Progress",
                        deadline=date.today(),
                        assignee_id=users_by_username["venesa"].id,
                    ),
                    models.Task(
                        title="Prepare API documentation",
                        description="Document login, task CRUD, and user endpoints for Postman.",
                        status="Todo",
                        deadline=date.today(),
                        assignee_id=users_by_username.get("alya", venesa).id,
                    ),
                    models.Task(
                        title="Review chatbot responses",
                        description="Validate the AI assistant answers against task data.",
                        status="Done",
                        deadline=date.today(),
                        assignee_id=users_by_username.get("rizky", venesa).id,
                    ),
                ]
            )
            db.commit()
    finally:
        db.close()


seed_demo_data()

app.include_router(users.router)
app.include_router(tasks.router)
app.include_router(login.router)
app.include_router(chatbot.router)


@app.get("/")
def root():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "message": "Connected to PostgreSQL successfully!"
        }

    except Exception as e:
        return {
            "message": "Database connection failed",
            "error": str(e)
        }