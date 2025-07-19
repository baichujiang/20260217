from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import desc
from datetime import date, timedelta
from .models import DailyCheckin
from app.points.service import add_points

async def has_checked_in_today(user_id: int, db: AsyncSession) -> bool:
    today = date.today()
    stmt = select(DailyCheckin).where(
        DailyCheckin.user_id == user_id, DailyCheckin.date == today
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none() is not None

async def get_current_streak(user_id: int, db: AsyncSession) -> int:
    stmt = select(DailyCheckin).where(
        DailyCheckin.user_id == user_id
    ).order_by(desc(DailyCheckin.date))
    result = await db.execute(stmt)
    records = result.scalars().all()

    streak = 0
    expected_date = date.today()

    for record in records:
        if record.date == expected_date:
            streak += 1
            expected_date -= timedelta(days=1)
        elif record.date == expected_date - timedelta(days=1):
            streak += 1
            expected_date -= timedelta(days=1)
        else:
            break

    return streak


async def perform_checkin(user_id: int, db: AsyncSession):
    from app.badges.service import check_and_award_badges

    already_checked_in = await has_checked_in_today(user_id, db)

    if not already_checked_in:
        checkin = DailyCheckin(user_id=user_id, date=date.today())
        db.add(checkin)

        await add_points(user_id=user_id, amount=5, db=db, reason="daily_checkin")

        action_message = "Check-in successful! +5 points awarded."
    else:
        action_message = "Already checked in today."

    streak = await get_current_streak(user_id, db)
    await check_and_award_badges(user_id=user_id, db=db, streak_count=streak)

    await db.commit()

    return not already_checked_in, action_message, streak
