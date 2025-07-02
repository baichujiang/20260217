# app/badges/routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.auth.services import get_current_user
from app.core.database import get_db
from app.users.models import User
from .models import UserBadge, BadgeDefinition
from .schemas import BadgeOut

router = APIRouter(prefix="/badges", tags=["Badges"])

@router.get("/my", response_model=List[BadgeOut])
async def get_all_badges_with_user_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 查询所有徽章定义
    result = await db.execute(select(BadgeDefinition))
    all_defs = result.scalars().all()

    # 查询当前用户的徽章进度
    result = await db.execute(
        select(UserBadge).where(UserBadge.user_id == current_user.id)
    )
    user_badges = { (b.badge_type, b.level): b for b in result.scalars().all() }

    badge_list = []
    for definition in all_defs:
        ub = user_badges.get((definition.badge_type, definition.level))
        badge_list.append(BadgeOut(
            id=definition.id,
            name=definition.name,
            description=definition.description,
            icon=definition.icon,
            category=definition.category,
            currentProgress=ub.progress if ub else 0,
            requiredProgress=definition.required_progress,
            unlocked=ub.level > 0 if ub else False,
            lastUnlocked=None  # 可选：如记录时间可加
        ))

    return badge_list
