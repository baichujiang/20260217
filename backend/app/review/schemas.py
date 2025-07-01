from pydantic import BaseModel, Field, conint
from typing import Annotated, List, Optional
from uuid import UUID
from datetime import datetime
from enum import Enum

class TagCategory(str, Enum):
    SOURCING = "Sourcing"
    WASTE = "Waste"
    MENU = "Menu"
    ENERGY = "Energy"

Rating = Annotated[int, conint(ge=1, le=5)]


# --- ReviewTag Schemas ---
class ReviewTagBase(BaseModel):
    name: str
    category: TagCategory

class ReviewTagCreate(ReviewTagBase):
    id: int

class ReviewTagRead(ReviewTagBase):
    id: int

    class Config:
        orm_mode = True


# --- ReviewImage Schemas ---
class ReviewImageCreate(BaseModel):
    file_path: str
    
    class Config:
        orm_mode = True

class ReviewImageRead(BaseModel):
    id: UUID
    file_path: str
    uploaded_at: datetime

    class Config:
        orm_mode = True


# --- Review Schemas ---
class ReviewBase(BaseModel):
    normal_rating: Rating
    food_rating: Rating
    service_rating: Rating
    environment_rating: Rating
    sustainablility_rating: Rating
    sourcing_rating: Rating
    waste_rating: Rating
    menu_rating: Rating
    energy_rating: Rating
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    restaurant_id: int
    tag_ids: Optional[List[int]] = []


class ReviewRead(ReviewBase):
    id: UUID
    user_id: int
    restaurant_id: int
    created_at: datetime
    tags: List[ReviewTagRead] = []
    images: List[ReviewImageRead] = []

    class Config:
        orm_mode = True
