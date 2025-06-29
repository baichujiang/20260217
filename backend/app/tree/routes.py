# app/tree/routes.py

from fastapi import APIRouter, Depends, HTTPException                # FastAPI 路由与异常处理
from sqlalchemy.ext.asyncio import AsyncSession                     # 异步数据库会话类型
from app.core.database import get_db         
from sqlalchemy import select                                        # 获取数据库依赖
from . import service, schemas, models                                       # 引入 service 与 schema
from app.auth.services import get_current_user  # ✅ 导入
from app.users.models import User
from typing import List
from app.watering.schemas import WaterTreeRequest

router = APIRouter(prefix="/trees", tags=["Trees"])                  # 路由前缀与标签


# 查询所有树种
@router.get("/types", response_model=list[schemas.TreeTypeOut])
async def get_tree_types(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.TreeType))
    return result.scalars().all()

# 添加新树种
@router.post("/types", response_model=schemas.TreeTypeOut)
async def create_tree_type(data: schemas.TreeTypeCreate, db: AsyncSession = Depends(get_db)):
    new_type = models.TreeType(**data.dict())
    db.add(new_type)
    await db.commit()
    await db.refresh(new_type)
    return new_type

# 修改已有树种
@router.put("/types/{type_id}", response_model=schemas.TreeTypeOut)
async def update_tree_type(type_id: int, data: schemas.TreeTypeCreate, db: AsyncSession = Depends(get_db)):
    tree_type = await db.get(models.TreeType, type_id)
    if not tree_type:
        raise HTTPException(status_code=404, detail="Tree type not found")
    for key, value in data.dict().items():
        setattr(tree_type, key, value)
    await db.commit()
    await db.refresh(tree_type)
    return tree_type

# 删除树种
@router.delete("/types/{type_id}")
async def delete_tree_type(type_id: int, db: AsyncSession = Depends(get_db)):
    tree_type = await db.get(models.TreeType, type_id)
    if not tree_type:
        raise HTTPException(status_code=404, detail="Tree type not found")
    await db.delete(tree_type)
    await db.commit()
    return {"message": "Tree type deleted"}


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

@router.delete("/trees/{tree_id}")
async def delete_tree(tree_id: int, db: AsyncSession = Depends(get_db)):
    tree = await db.get(models.Tree, tree_id)
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")
    await db.delete(tree)
    await db.commit()
    return {"message": "Tree deleted"}

