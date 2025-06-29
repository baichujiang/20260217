# app/tree/routes.py

from fastapi import APIRouter, Depends, HTTPException                # FastAPI 路由与异常处理
from sqlalchemy.ext.asyncio import AsyncSession                     # 异步数据库会话类型
from app.core.database import get_db         
from sqlalchemy import select                                        # 获取数据库依赖
from . import service, schemas, models                                       # 引入 service 与 schema
from app.users.deps import get_current_user  # ✅ 导入
from app.users.models import User
from typing import List
from app.watering.schemas import WaterTreeRequest
from app.tree.schemas import TreeTypeOut
from app.tree.models import TreeType



router = APIRouter(prefix="/trees", tags=["Trees"])                  # 路由前缀与标签

# 获取所有树的类型（GET /tree-types/）
@router.get("/types", response_model=List[TreeTypeOut])
async def list_tree_types(session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(TreeType))
    types = result.scalars().all()
    return types


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

# 获取当前用户所有树的接口（GET /trees/me）
@router.get("/me", response_model=List[schemas.Tree])
async def get_my_trees(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return await service.get_user_trees(db, user_id=current_user.id)


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

# 删除树的接口（DELETE /trees/{tree_id}）
@router.delete("/trees/{tree_id}")
async def delete_tree(tree_id: int, db: AsyncSession = Depends(get_db)):
    tree = await db.get(models.Tree, tree_id)
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    await db.delete(tree)
    await db.commit()
    return {"message": "Tree deleted"}

