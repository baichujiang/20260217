# app/users/routers.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from ..users.models import User
from .schemas import UserOut
from ..core.database import get_db
from ..auth.services import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/me", summary="Get Current User Info", response_model=UserOut)
async def get_current_user_info(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    获取当前登录用户的基本信息和总积分。
    """
    result = await db.execute(
        select(User)
        .where(User.id == current_user.id)
        .options(selectinload(User.points))  # ✅ 预加载 points，避免懒加载
    )
    user = result.scalar_one()

    total = sum(p.amount for p in user.points) if user.points else 0

    return UserOut(
        id=user.id,
        username=user.username,
        total_points=total
    )


@router.get("/", summary="Get All Users", response_model=List[UserOut])
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

@router.get("/{user_id}", summary="Get A Single User", response_model=UserOut)
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

