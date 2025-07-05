from pydantic import BaseModel
from typing import Optional

class BadgeOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = ""  # 允许为空
    icon: Optional[str] = "/default-badge.png"  # 给个默认路径
    category: str
    currentProgress: int  # 当前进度（如已收获多少次）
    requiredProgress: int  # 解锁该等级所需进度
    unlocked: bool  # 是否已解锁该等级
    lastUnlocked: Optional[str] = None  # 如果需要展示最近一次解锁时间

    class Config:
        from_attributes = True  # Pydantic v2 替代 orm_mode
