from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime

class UserSafe(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True

class RewardDeliveryOut(BaseModel):
    id: int
    tree_id: int
    full_name: str
    street_address: str
    postal_code: str
    city: str
    state: str
    phone_number: str
    submitted_at: datetime
    user: UserSafe

    class Config:
        orm_mode = True

class HarvestRewardRequest(BaseModel):
    full_name: str = Field(..., description="Full name of the recipient")
    street_address: str = Field(..., description="Street and house number")
    postal_code: str = Field(..., description="Postal code")
    city: str = Field(..., description="City")
    state: Optional[str] = Field(None, description="State (optional)")
    phone_number: str = Field(..., description="Phone number")
