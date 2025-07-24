# app/users/schemas.py
from pydantic import BaseModel
from typing import Optional

class UserInfoRead(BaseModel):
    id: int
    username: str
    total_points: int
    avatar_url: Optional[str] = None

    class Config:
        orm_mode = True


class UserAvatarInfo(BaseModel):
    id: int
    username: str
    avatar_url: str

    class Config:
        orm_mode = True


class TokenData(BaseModel):
    sub: str | None = None
