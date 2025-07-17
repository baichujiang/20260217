# app/users/routers.py
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from .models import User
from .schemas import UserInfoRead, UserAvatarInfo
from ..auth.services import get_current_user
from ..core.database import get_db
from ..auth.services import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/", summary="Get All Users", response_model=List[UserInfoRead])
async def get_users(db: AsyncSession = Depends(get_db)):
    """
    获取所有用户及其当前积分（排行榜）。
    """
    # 预加载 points 关系，避免懒加载触发异步 IO 错误
    result = await db.execute(
        select(User).options(selectinload(User.points))
    )
    users = result.scalars().all()

    leaderboard: List[UserInfoRead] = []
    for user in users:
        total = sum(point.amount for point in user.points) if user.points else 0
        leaderboard.append(UserInfoRead(
            id=user.id,
            username=user.username,
            total_points=total
        ))
    return leaderboard

# Update avatar URL
@router.put("/avatar", response_model=UserAvatarInfo)
async def set_avatar(
    avatar_url: str = Body(..., embed=True),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    user.avatar_url = avatar_url
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

# Get the current user's profile
@router.get("/me", response_model=UserInfoRead)
async def get_me(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user)
):
    result = await db.execute(
        select(User)
        .where(User.id == user.id)
        .options(selectinload(User.points))
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    total = sum(point.amount for point in user.points) if user.points else 0
    return UserInfoRead(
        id=user.id,
        username=user.username,
        total_points=total,
        avatar_url = user.avatar_url
    )

@router.get("/{user_id}", summary="Get A Single User", response_model=UserInfoRead)
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
    return UserInfoRead(
        id=user.id,
        username=user.username,
        total_points=total,
        avatar_url=user.avatar_url
    )

