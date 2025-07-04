from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True  # ✅ use this instead of orm_mode in Pydantic v2

class Token(BaseModel):
    access_token: str
    token_type: str
