# points/schemas.py

from pydantic import BaseModel
from datetime import datetime

# 基础字段
class PointBase(BaseModel):
    amount: int
    reason: str

# ✅ 创建请求体，不需要 user_id 了
class PointCreate(PointBase):
    pass

# 返回体
class Point(PointBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
