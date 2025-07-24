from pydantic import BaseModel
from datetime import datetime

class PointBase(BaseModel):
    amount: int
    reason: str

class PointCreate(PointBase):
    pass

class Point(PointBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
