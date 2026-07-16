from sqlalchemy.orm import Session
from app import models, schemas
from sqlalchemy.orm import Session
from app import models, schemas


# =========================
# USER
# =========================

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        name=user.name,
        username=user.username,
        password=user.password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_users(db: Session):
    return db.query(models.User).all()


# =========================
# TASK
# =========================

def create_task(db: Session, task: schemas.TaskCreate):
    db_task = models.Task(
        title=task.title,
        description=task.description,
        status=task.status,
        deadline=task.deadline,
        assignee_id=task.assignee_id
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


def get_tasks(db: Session):
    return db.query(models.Task).all()

def get_task(db: Session, task_id: int):
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def update_task(db: Session, task_id: int, task: schemas.TaskCreate):
    db_task = get_task(db, task_id)

    if not db_task:
        return None

    db_task.title = task.title
    db_task.description = task.description
    db_task.status = task.status
    db_task.deadline = task.deadline
    db_task.assignee_id = task.assignee_id

    db.commit()
    db.refresh(db_task)

    return db_task


def delete_task(db: Session, task_id: int):
    db_task = get_task(db, task_id)

    if not db_task:
        return None

    db.delete(db_task)
    db.commit()

    return db_task


def update_task_status(db: Session, task_id: int, status: str):
    db_task = get_task(db, task_id)

    if not db_task:
        return None

    db_task.status = status

    db.commit()
    db.refresh(db_task)

    return db_task

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(
        models.User.username == username
    ).first()