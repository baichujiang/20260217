# app/watering/schemas.py
from pydantic import BaseModel
from typing import Optional

class UserOut(BaseModel):
    id: int
    username: str
    watering_amount: int  # 这里是浇水积分

    class Config:
        orm_mode = True

class WaterTreeRequest(BaseModel):
    amount: int
    growth_value: Optional[int] = None  # 可选字段