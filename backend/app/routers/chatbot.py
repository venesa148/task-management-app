from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

from app.services.chatbot import ask_llm

router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"]
)


@router.post("/")
def chat(data: dict, db: Session = Depends(get_db)):

    tasks = db.query(models.Task).all()

    context = ""

    for task in tasks:

        assignee = task.assignee.name if task.assignee else "-"

        context += f"""
Title : {task.title}
Description : {task.description}
Status : {task.status}
Deadline : {task.deadline}
Assignee : {assignee}

"""

    answer = ask_llm(context, data["message"])

    return {
        "answer": answer
    }