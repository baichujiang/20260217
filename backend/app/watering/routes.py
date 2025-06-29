from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.future import select
from datetime import datetime, timedelta
from typing import List

from ..core.database import get_db
from ..users.models import User
from .models import WateringLog
from .schemas import UserOut
from ..tree.models import Tree
from app.auth.services import get_current_user

router = APIRouter()

def get_start_time(period: str) -> datetime | None:
    now = datetime.utcnow()
    if period == "daily":
        return now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start_of_week = now - timedelta(days=now.weekday())
        return start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "total":
        return None
    raise HTTPException(status_code=400, detail="Invalid period")


@router.get("/watering/leaderboard", response_model=List[UserOut])
async def get_leaderboard(
    period: str = Query("total"),
    db: AsyncSession = Depends(get_db)
):
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

    user_ids = [row.user_id for row in rows]
    user_stmt = select(User).where(User.id.in_(user_ids))
    users_res = await db.execute(user_stmt)
    users = users_res.scalars().all()

    watering_map = {row.user_id: row.watering_amount for row in rows}
    leaderboard: List[UserOut] = []
    for uid in user_ids:
        user = next((u for u in users if u.id == uid), None)
        if user:
            leaderboard.append(
                UserOut(
                    id=user.id,
                    username=user.username,
                    watering_amount=watering_map.get(uid, 0),
                )
            )
    return leaderboard


@router.post("/trees/{tree_id}/water")
async def water_tree(
    tree_id: int,
    amount: int = Query(..., description="Amount of water to apply (also equals point to deduct)"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tree = await db.get(Tree, tree_id)
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")

    if tree.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot water someone else's tree.")

    tree.growth_value += amount
    db.add(tree)

    log = WateringLog(
        user_id=current_user.id,
        tree_id=tree_id,
        amount=amount,
        timestamp=datetime.utcnow()
    )
    db.add(log)

    await db.commit()
    await db.refresh(tree)

    return {"message": "Tree watered successfully", "growth_value": tree.growth_value}
