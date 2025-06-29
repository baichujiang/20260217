from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from . import service, schemas
from app.users.models import User
from app.auth.services import get_current_user

router = APIRouter(prefix="/points", tags=["Points"])

# ✅ 添加积分记录（不需要前端传 user_id）
@router.post("/", response_model=schemas.Point)
async def add_point(
    point_in: schemas.PointCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await service.add_points(
        db=db,
        user_id=current_user.id,
        amount=point_in.amount,
        reason=point_in.reason
    )

# ✅ 获取当前用户的所有积分记录
@router.get("/me", response_model=list[schemas.Point])
async def get_my_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await service.get_user_points(db=db, user_id=current_user.id)

# ✅ 获取当前用户的积分总额
@router.get("/me/total")
async def get_my_total_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = await service.get_user_total_points(db=db, user_id=current_user.id)
    return {"username": current_user.username, "total_points": total}

# ✅ 重置当前用户积分
@router.post("/me/reset")
async def reset_my_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await service.reset_user_points(db=db, user_id=current_user.id)
    return {"message": "Points reset"}
