from pydantic import BaseModel
from datetime import date


class UserBase(BaseModel):
    name: str
    username: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserSimple(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: str
    status: str
    deadline: date
    assignee_id: int


class TaskCreate(TaskBase):
    pass


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str
    status: str
    deadline: date

    assignee: UserSimple

    class Config:
        from_attributes = True

class TaskStatusUpdate(BaseModel):
    status: str


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str