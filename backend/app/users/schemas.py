# app/users/schemas.py
from pydantic import BaseModel

class UserInfoRead(BaseModel):
    id: int
    username: str
    total_points: int
    avatar_url: str

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
