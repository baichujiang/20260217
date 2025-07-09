# app/points/service.py

from sqlalchemy.ext.asyncio import AsyncSession                 # 异步数据库会话
from sqlalchemy import select, func                             # SQL 表达式构造器
from datetime import datetime
from . import models                                             # 积分数据模型

# 添加一笔新的积分记录
async def add_points(db: AsyncSession, user_id: int, amount: int, reason: str):
    point = models.Point(                                        # 创建积分对象
        user_id=user_id,
        amount=amount,
        reason=reason,
        created_at=datetime.utcnow()
    )
    db.add(point)                                                # 添加到数据库会话
    await db.commit()                                            # 提交事务
    await db.refresh(point)                                      # 刷新对象状态
    return point                                                 # 返回新建的记录

# 查询某个用户的总积分
async def get_user_total_points(db: AsyncSession, user_id: int):
    stmt = select(func.sum(models.Point.amount)).where(models.Point.user_id == user_id)
    result = await db.execute(stmt)                              # 执行聚合查询
    total = result.scalar()                                      # 获取总和（标量）
    return total or 0                                            # 若为 None 返回 0

# 查询某个用户的所有积分记录（按时间倒序）
async def get_user_points(db: AsyncSession, user_id: int):
    stmt = select(models.Point).where(models.Point.user_id == user_id).order_by(models.Point.created_at.desc())
    result = await db.execute(stmt)                              # 执行查询
    return result.scalars().all()                                # 返回所有记录对象

# 积分扣除（前提是积分足够），否则返回 None
async def deduct_points_if_possible(db: AsyncSession, user_id: int, amount: int, reason: str):
    total = await get_user_total_points(db, user_id=user_id)     # 获取当前积分总数
    if total < amount:
        return None                                               # 积分不足
    return await add_points(db, user_id, -amount, reason)         # 添加负积分记录
