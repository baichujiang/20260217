from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.auth.services import get_current_user
from app.core.database import get_db
from app.users.models import User
from datetime import date
from . import service, schemas

router = APIRouter(prefix="/checkin", tags=["Check-in"])

@router.get("/status", response_model=schemas.CheckinResponse)
async def check_status(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    checked_in = await service.has_checked_in_today(current_user.id, db)
    streak = await service.get_current_streak(current_user.id, db)
    return schemas.CheckinResponse(
        checked_in=checked_in,
        date=date.today(),
        message="Already checked in" if checked_in else "Not yet checked in",
        current_streak=streak
    )

@router.post("/", response_model=schemas.CheckinActionResponse)
async def do_checkin(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    success, message, streak = await service.perform_checkin(current_user.id, db)
    return schemas.CheckinActionResponse(
        success=success,
        message=message,
        current_streak=streak
    )
