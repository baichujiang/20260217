# app/tree/routes.py

from fastapi import APIRouter, Depends, HTTPException, Query                # FastAPI 路由与异常处理
from sqlalchemy.ext.asyncio import AsyncSession                     # 异步数据库会话类型
from app.core.database import get_db         
from sqlalchemy import select, func                                      # 获取数据库依赖
from . import service, schemas, models                                       # 引入 service 与 schema
from app.auth.services import get_current_user  # ✅ 导入
from app.users.models import User
from typing import List
from app.tree.schemas import TreeTypeOut, WaterTreeRequest, UserOut
from app.tree.models import TreeType, WateringLog
from datetime import datetime, timedelta

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

router = APIRouter(prefix="/trees", tags=["Trees"])                  # 路由前缀与标签

# 获取所有树的类型（GET /tree-types/）
@router.get("/types", response_model=List[TreeTypeOut])
async def list_tree_types(session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(TreeType))
    types = result.scalars().all()
    return types

# 获取当前用户所有树的接口（GET /trees/me）
@router.get("/me", response_model=List[schemas.Tree])
async def get_my_trees(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await service.get_user_trees(db, user_id=current_user.id)

@router.get("/leaderboard", response_model=List[UserOut])
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

# 种树接口（POST /trees/）
@router.post("/", response_model=schemas.Tree)
async def create_tree(
    tree_in: schemas.TreeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)  # ✅ 从 token 中自动解析用户
):
    return await service.create_tree(
        db=db,
        user_id=current_user.id,  # ✅ 不再使用 tree_in.user_id
        tree_in=tree_in
    )

# 浇水接口（POST /trees/{tree_id}/water）
@router.post("/{tree_id}/water", response_model=schemas.Tree)
async def water_tree(
    tree_id: int,
    data: WaterTreeRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await service.water_tree(
        db=db,
        user_id=current_user.id,
        tree_id=tree_id,
        amount=data.amount
    )

# 删除树的接口
@router.delete("/{tree_id}")
async def delete_tree(tree_id: int, db: AsyncSession = Depends(get_db)):
    tree = await db.get(models.Tree, tree_id)
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    await db.delete(tree)
    await db.commit()
    return {"message": "Tree deleted"}
