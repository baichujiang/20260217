from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date
from app.core.database import get_db
from app.auth.services import get_current_user
from app.users.models import User
from app.points.models import Point
from app.points.service import add_points

router = APIRouter(prefix="/share", tags=["Share"])

@router.post("/{share_type}")
async def share_action(
    share_type: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    today = date.today()

    # 检查今天是否已分享该类型（例如 share:watering）
    result = await db.execute(
        select(Point).where(
            Point.user_id == current_user.id,
            Point.reason == f"share:{share_type}",
            Point.created_at >= today
        )
    )
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="You already shared today.")

    # 添加积分奖励
    await add_points(db, current_user.id, 10, reason=f"share:{share_type}")

    return {"message": "Shared successfully. 10 points awarded!"}
