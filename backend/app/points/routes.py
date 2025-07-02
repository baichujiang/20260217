from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from . import service, schemas
from app.users.models import User
from app.auth.services import get_current_user

router = APIRouter(prefix="/points", tags=["Points"])

# ✅ 添加积分记录
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

# ✅ 扣除当前用户积分
@router.post("/deduct")
async def deduct_points(
    data: schemas.PointCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await service.deduct_points_if_possible(
        db=db,
        user_id=current_user.id,
        amount=data.amount,
        reason=data.reason
    )
    if result is None:
        raise HTTPException(status_code=400, detail="Not enough points")

    return {"message": "Points deducted successfully", "new_record": result}

# ✅ 获取当前用户的积分总额
@router.get("/me/total")
async def get_my_total_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total = await service.get_user_total_points(db=db, user_id=current_user.id)
    return {"username": current_user.username, "total_points": total}

# ✅ 获取当前用户的所有积分记录
@router.get("/me", summary="Get My Points Records", response_model=list[schemas.Point])
async def get_my_points(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await service.get_user_points(db=db, user_id=current_user.id)
