from pydantic import BaseModel

class BadgeOut(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    category: str
    currentProgress: int
    requiredProgress: int
    unlocked: bool
    lastUnlocked: str | None = None  # 如果你将来想加解锁时间

    class Config:
        from_attributes = True  # Pydantic v2 替代 orm_mode
