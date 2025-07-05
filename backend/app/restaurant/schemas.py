from pydantic import BaseModel, HttpUrl, Field
from typing import Optional


class RestaurantBase(BaseModel):
    name: str = Field(...)
    address: str = Field(...)
    website: Optional[str] = Field(None)
    normal_score: Optional[float] = None
    sustainability_score: Optional[float] = None
    sourcing_score: Optional[float] = None
    waste_score: Optional[float] = None
    menu_score: Optional[float] = None
    energy_score: Optional[float] = None

class RestaurantCreate(RestaurantBase):
    name: str
    address: str


class RestaurantUpdate(RestaurantBase):
    pass


class RestaurantOut(RestaurantBase):
    id: int

    class Config:
        orm_mode = True

class TopTagOut(BaseModel):
    name: str
    category: str
    count: int