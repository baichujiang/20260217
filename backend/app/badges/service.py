from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.badges.models import UserBadge, BadgeDefinition
from app.tree.models import WateringLog
from app.harvest.models import HarvestLog


BADGE_LEVELS = {
    "watering": [10, 100, 1000],
    "grower": [5, 20, 100],  # ✅ 改为与 harvest 相同的标准
    "reviewer": [3, 10, 30],
    "harvest": [5, 20, 100],
}


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
            max_progress=BADGE_LEVELS[badge_type][0]
        )
        db.add(badge)
    return badge


async def check_and_award_badges(user_id: int, db: AsyncSession):
    # 获取用户行为数据
    res = await db.execute(select(WateringLog).where(WateringLog.user_id == user_id))
    watering_count = len(res.scalars().all())

    res = await db.execute(select(HarvestLog).where(HarvestLog.user_id == user_id))
    harvest_count = len(res.scalars().all())

    # ✅ 用 harvest_count 替代 grower_total
    badge_data = {
        "watering": watering_count,
        "grower": harvest_count,   # ✅ grower 现在统计的是收获次数
        "harvest": harvest_count
    }

    # 获取所有徽章定义
    res = await db.execute(select(BadgeDefinition))
    all_definitions = res.scalars().all()

    # 获取用户现有的徽章
    res = await db.execute(select(UserBadge).where(UserBadge.user_id == user_id))
    user_badges = {(b.badge_type, b.level): b for b in res.scalars().all()}

    # 遍历徽章定义，判断是否需要更新或新增徽章
    for definition in all_definitions:
        progress = badge_data.get(definition.badge_type, 0)
        key = (definition.badge_type, definition.level)
        badge = user_badges.get(key)

        if badge:
            badge.progress = progress
            badge.max_progress = definition.required_progress

            # 新增：若进度已满足下一等级，且尚未解锁
            if badge.level == 0 and progress >= definition.required_progress:
                badge.level = definition.level
        else:
            new_badge = UserBadge(
                user_id=user_id,
                badge_type=definition.badge_type,
                level=definition.level if progress >= definition.required_progress else 0,
                progress=progress,
                max_progress=definition.required_progress
            )
            db.add(new_badge)


    await db.commit()
