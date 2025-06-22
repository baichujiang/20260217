# app/users/routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from ..auth.models import User
from .schemas import UserOut
from ..core.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/", response_model=List[UserOut])
async def get_users(db: AsyncSession = Depends(get_db)):
    """
    获取所有用户及其当前积分（排行榜）。
    """
    # 预加载 points 关系，避免懒加载触发异步 IO 错误
    result = await db.execute(
        select(User).options(selectinload(User.points))
    )
    users = result.scalars().all()

    leaderboard: List[UserOut] = []
    for user in users:
        total = sum(point.amount for point in user.points) if user.points else 0
        leaderboard.append(UserOut(
            id=user.id,
            username=user.username,
            total_points=total
        ))
    return leaderboard

@router.get("/{user_id}", response_model=UserOut)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    """
    获取单个用户及其当前积分余额。
    """
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(selectinload(User.points))
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    total = sum(point.amount for point in user.points) if user.points else 0
    return UserOut(
        id=user.id,
        username=user.username,
        total_points=total
    )
