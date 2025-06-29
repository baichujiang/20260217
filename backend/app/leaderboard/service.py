from datetime import datetime, timedelta
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.watering.models import WateringLog
from app.users.models import User
from app.tree.schemas import UserOut

def get_start_time(period: str) -> datetime | None:
    now = datetime.utcnow()
    if period == "daily":
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        return now - timedelta(days=now.weekday(), hours=now.hour, minutes=now.minute, seconds=now.second)
    elif period == "total":
        return None
    raise ValueError("Invalid period")

async def get_leaderboard(period: str, db: AsyncSession) -> list[UserOut]:
    start_time = get_start_time(period)

    stmt = (
        select(
            WateringLog.user_id,
            func.sum(WateringLog.amount).label("watering_amount")
        )
        .group_by(WateringLog.user_id)
        .order_by(func.sum(WateringLog.amount).desc())
    )
    if start_time:
        stmt = stmt.where(WateringLog.timestamp >= start_time)

    result = await db.execute(stmt)
    rows = result.all()

    if not rows:
        return []

    user_ids = [r.user_id for r in rows]
    users_res = await db.execute(select(User).where(User.id.in_(user_ids)))
    users = users_res.scalars().all()

    watering_map = {r.user_id: r.watering_amount for r in rows}
    return [
        UserOut(
            id=u.id,
            username=u.username,
            watering_amount=watering_map.get(u.id, 0)
        )
        for u in users if u.id in watering_map
    ]
