from pydantic import BaseModel, ConfigDict, HttpUrl, conint
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

    model_config = ConfigDict(from_attributes=True)


# --- ReviewImage Schemas ---
class ReviewImageRead(BaseModel):
    id: UUID
    url: HttpUrl
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)


# --- Review Schemas ---
class ReviewBase(BaseModel):
    normal_rating: Rating
    food_rating: Rating
    service_rating: Rating
    environment_rating: Rating
    sustainability_rating: float
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

class ReviewCommentRead(BaseModel):
    review_id: UUID
    user_name: str
    avatar_url: str
    created_at: str
    comment: str
    normal_rating: Rating
    sustainability_rating: Rating
    images: List[ReviewImageRead]

    class Config:
        orm_mode = True
