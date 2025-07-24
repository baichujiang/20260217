from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.badges.models import UserBadge, BadgeDefinition
from app.tree.models import WateringLog
from app.harvest.models import HarvestLog
from app.checkin.service import get_current_streak
from collections import defaultdict


async def get_or_create_badge(db: AsyncSession, user_id: int, badge_type: str):
    result = await db.execute(
        select(UserBadge).where(UserBadge.user_id == user_id, UserBadge.badge_type == badge_type)
    )
    badge = result.scalar_one_or_none()
    if badge is None:
        badge = UserBadge(
            user_id=user_id,
            badge_type=badge_type,
            level=0,
            progress=0,
            max_progress=first_def.required_progress if first_def else 0
        )
        db.add(badge)
    return badge


async def check_and_award_badges(user_id: int, db: AsyncSession, streak_count: int = 0):
    res = await db.execute(select(WateringLog).where(WateringLog.user_id == user_id))
    watering_count = len(res.scalars().all())

    res = await db.execute(select(HarvestLog).where(HarvestLog.user_id == user_id))
    harvest_count = len(res.scalars().all())

    badge_data = {
        "watering": watering_count,
        "grower": harvest_count,  
        "streak": streak_count
    }

    res = await db.execute(select(BadgeDefinition))
    all_definitions = res.scalars().all()

    res = await db.execute(select(UserBadge).where(UserBadge.user_id == user_id))
    
    raw_badges = res.scalars().all()
    user_badges_by_type = defaultdict(list)
    for badge in raw_badges:
        user_badges_by_type[badge.badge_type].append(badge)

    for badges in user_badges_by_type.values():
        badges.sort(key=lambda b: b.level)


    for definition in all_definitions:
        progress = badge_data.get(definition.badge_type, 0)

        user_badges = user_badges_by_type.get(definition.badge_type, [])
        user_badge_at_level = next((b for b in user_badges if b.level == definition.level), None)

        if user_badge_at_level:
            user_badge_at_level.progress = progress
            user_badge_at_level.max_progress = definition.required_progress

            if user_badge_at_level.level == 0 and progress >= definition.required_progress:
                user_badge_at_level.level = definition.level
        else:
            new_badge = UserBadge(
                user_id=user_id,
                badge_type=definition.badge_type,
                level=definition.level,
                progress=progress,
                max_progress=definition.required_progress
            )
            db.add(new_badge)

    await db.commit()
