from datetime import date
from pydantic import BaseModel


class CheckinResponse(BaseModel):
    checked_in: bool
    date: date
    message: str
    current_streak: int

class CheckinActionResponse(BaseModel):
    success: bool
    message: str
    current_streak: int
