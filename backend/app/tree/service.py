# app/tree/service.py

from sqlalchemy.ext.asyncio import AsyncSession                       # 异步数据库会话
from sqlalchemy import select                                         # 异步查询方式
from . import models, schemas                                         # 本模块模型与 schema
from app.points import service as point_service                       # 引入积分服务
from fastapi import HTTPException, status
from .models import WateringLog
from sqlalchemy.orm import selectinload  # ✅ 添加这一行
from app.badges.service import check_and_award_badges

# 创建一棵新树，并奖励积分
async def create_tree(db: AsyncSession, user_id: int, tree_in: schemas.TreeCreate):
    # 获取 TreeType
    stmt = select(models.TreeType).where(models.TreeType.id == tree_in.type_id)
    result = await db.execute(stmt)
    tree_type = result.scalar_one_or_none()
    if tree_type is None:
        raise HTTPException(status_code=404, detail="Tree type not found")

    # 创建树
    new_tree = models.Tree(
        user_id=user_id,
        name=tree_type.species,    # ✅ 可以用 species 作为 name 或者你自己取默认值
        species=tree_type.species, # ✅ 保留这个字符串字段用于展示
        type=tree_type             # ✅ 正确设置关系字段
    )
    db.add(new_tree)
    await db.commit()
    
    # 种树奖励
    await point_service.add_points(
        db=db, user_id=user_id, amount=10, reason="tree_created"
    )

    return await get_tree(db, new_tree.id)


# 获取用户所有的树（按时间倒序）
async def get_user_trees(db: AsyncSession, user_id: int):
    stmt = (select(models.Tree).where(models.Tree.user_id == user_id)\
                              .order_by(models.Tree.created_at.desc())
                              .options(selectinload(models.Tree.type))  # ✅ 关键预加载
    )
    result = await db.execute(stmt)
    return result.scalars().all()

# 获取单棵树
async def get_tree(db: AsyncSession, tree_id: int):
    stmt = (select(models.Tree).where(models.Tree.id == tree_id)
                               .options(selectinload(models.Tree.type))  # ✅ 加这一行
    )
    result = await db.execute(stmt)
    return result.scalars().first()

# 浇水功能：扣积分 + 增加成长值
async def water_tree(db: AsyncSession, user_id: int, tree_id: int, amount: int):
    # 查找树
    tree = await get_tree(db, tree_id)
    if not tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tree not found"
        )

    # 确保是自己的树
    if tree.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to water this tree"
        )

    # 积分不够会抛错（None）
    result = await point_service.deduct_points_if_possible(
        db=db,
        user_id=user_id,
        amount=amount,
        reason="water_tree"
    )
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough points to water"
        )

    # 成长值增加
    tree.growth_value += amount
    log = WateringLog(user_id=user_id, tree_id=tree_id, amount=amount)
    db.add(log)
    await db.commit()
    await db.refresh(tree)
    await check_and_award_badges(user_id=user_id, db=db)

    return tree
