from pydantic import BaseModel
from typing import Optional

class BadgeOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = "" 
    icon: Optional[str] = "/default-badge.png" 
    category: str
    currentProgress: int  
    requiredProgress: int  
    unlocked: bool  
    lastUnlocked: Optional[str] = None  

    class Config:
        from_attributes = True  
