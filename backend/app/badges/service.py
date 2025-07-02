from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.badges.models import UserBadge, BadgeDefinition
from app.tree.models import Tree, WateringLog
from app.harvest.models import HarvestLog


BADGE_LEVELS = {
    "watering": [10, 100, 1000],
    "grower": [100, 1000, 5000],
    "reviewer": [3, 10, 30],
    "harvest": [5, 20, 100],
}

async def get_or_create_badge(db: AsyncSession, user_id: int, badge_type: str):
    result = await db.execute(
        select(UserBadge).where(UserBadge.user_id == user_id, UserBadge.badge_type == badge_type)
    )
    badge = result.scalar_one_or_none()
    if badge is None:
        badge = UserBadge(user_id=user_id, badge_type=badge_type, level=0, progress=0, max_progress=BADGE_LEVELS[badge_type][0])
        db.add(badge)
    return badge

async def check_and_award_badges(user_id: int, db: AsyncSession):
    # 统计行为数据
    res = await db.execute(select(WateringLog).where(WateringLog.user_id == user_id))
    watering_count = len(res.scalars().all())

    res = await db.execute(select(Tree).where(Tree.user_id == user_id))
    grower_total = sum(t.growth_value for t in res.scalars().all())

    res = await db.execute(select(HarvestLog).where(HarvestLog.user_id == user_id))
    harvest_count = len(res.scalars().all())

    badge_data = {
        "watering": watering_count,
        "grower": grower_total,
        "harvest": harvest_count
    }

    # 获取所有徽章定义
    res = await db.execute(select(BadgeDefinition))
    all_definitions = res.scalars().all()

    # 获取该用户所有 UserBadge
    res = await db.execute(select(UserBadge).where(UserBadge.user_id == user_id))
    user_badges = { (b.badge_type, b.level): b for b in res.scalars().all() }

    # 遍历定义，决定是否授予或更新徽章
    for definition in all_definitions:
        progress = badge_data.get(definition.badge_type, 0)
        key = (definition.badge_type, definition.level)
        badge = user_badges.get(key)

        if badge:
            badge.progress = progress
            badge.max_progress = definition.required_progress
            # 如果满足条件并尚未解锁
            if progress >= definition.required_progress and badge.level == 0:
                badge.level = definition.level
        else:
            # 没有这个徽章就新建
            new_badge = UserBadge(
                user_id=user_id,
                badge_type=definition.badge_type,
                level=definition.level if progress >= definition.required_progress else 0,
                progress=progress,
                max_progress=definition.required_progress
            )
            db.add(new_badge)

    await db.commit()
