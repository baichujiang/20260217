from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.auth.services import get_current_user
from app.core.database import get_db
from app.users.models import User
from .models import UserBadge, BadgeDefinition
from .schemas import BadgeOut
from .service import check_and_award_badges  
from app.checkin.service import get_current_streak


router = APIRouter(prefix="/badges", tags=["Badges"])

@router.get("/my", response_model=List[BadgeOut])
async def get_all_badges_with_user_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    streak_count = await get_current_streak(current_user.id, db)
    await check_and_award_badges(current_user.id, db, streak_count=streak_count)

    result = await db.execute(select(BadgeDefinition))
    all_defs = result.scalars().all()

    result = await db.execute(
        select(UserBadge).where(UserBadge.user_id == current_user.id)
    )
    user_badges = {(b.badge_type, b.level): b for b in result.scalars().all()}

    badge_list = []

    for definition in all_defs:
        ub = user_badges.get((definition.badge_type, definition.level))
        badge_list.append(BadgeOut(
            id=definition.id,
            name=definition.name,
            description=definition.description or "",
            icon=definition.icon or "/default-badge.png",
            category=definition.category,
            currentProgress=ub.progress if ub else 0,
            requiredProgress=definition.required_progress,
            unlocked=ub.level > 0 if ub else False,
            lastUnlocked=None  
        ))

    return badge_list
