from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TreeBase(BaseModel):
    type_id: int

class TreeCreate(TreeBase):
    pass

class TreeTypeOut(BaseModel):
    id: int
    species: str
    goal_growth_value: int
    image_src: str

    class Config:
        orm_mode = True

class TreeTypeCreate(BaseModel):
    species: str
    goal_growth_value: int
    image_src: str

class TreeInDBBase(TreeBase):
    id: int
    user_id: int
    growth_value: int
    created_at: datetime

    class Config:
        orm_mode = True

class Tree(TreeInDBBase):
    type: TreeTypeOut

class UserOut(BaseModel):
    id: int
    username: str
    watering_amount: int
    avatar_url: Optional[str] = None

    class Config:
        orm_mode = True

class WaterTreeRequest(BaseModel):
    amount: int
