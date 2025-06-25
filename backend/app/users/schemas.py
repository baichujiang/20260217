# app/users/schemas.py
from pydantic import BaseModel

class UserOut(BaseModel):
    id: int
    username: str
    total_points: int  # 当前积分余额

    class Config:
        orm_mode = True

class TokenData(BaseModel):
    sub: str | None = None  # 或 Optional[str] 取决于你用的是 Python 3.10+
