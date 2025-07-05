from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.auth.services import get_current_user
from app.core.database import get_db
from app.users.models import User
from .models import UserBadge, BadgeDefinition
from .schemas import BadgeOut
from .service import check_and_award_badges  # ✅ 导入更新函数

router = APIRouter(prefix="/badges", tags=["Badges"])

@router.get("/my", response_model=List[BadgeOut])
async def get_all_badges_with_user_progress(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # ✅ 每次获取徽章前先更新进度（很关键）
    await check_and_award_badges(current_user.id, db)

    # 查询所有徽章定义（含图标、类别、要求等）
    result = await db.execute(select(BadgeDefinition))
    all_defs = result.scalars().all()

    # 查询当前用户的所有徽章记录
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
            lastUnlocked=None  # 如 future 添加解锁时间，可改为 ub.lastUnlocked
        ))

    return badge_list
