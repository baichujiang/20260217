from sqlalchemy.ext.asyncio import AsyncSession   
from sqlalchemy import select, func                         
from datetime import datetime
from . import models                                 

async def add_points(db: AsyncSession, user_id: int, amount: int, reason: str):
    point = models.Point(                                      
        user_id=user_id,
        amount=amount,
        reason=reason,
        created_at=datetime.utcnow()
    )
    db.add(point)                                          
    await db.commit()                                    
    await db.refresh(point)                                   
    return point                                     

async def get_user_total_points(db: AsyncSession, user_id: int):
    stmt = select(func.sum(models.Point.amount)).where(models.Point.user_id == user_id)
    result = await db.execute(stmt)                             
    total = result.scalar()                                      
    return total or 0                                          

async def get_user_points(db: AsyncSession, user_id: int):
    stmt = select(models.Point).where(models.Point.user_id == user_id).order_by(models.Point.created_at.desc())
    result = await db.execute(stmt)                          
    return result.scalars().all()                          

async def deduct_points_if_possible(db: AsyncSession, user_id: int, amount: int, reason: str):
    total = await get_user_total_points(db, user_id=user_id)   
    if total < amount:
        return None                                            
    return await add_points(db, user_id, -amount, reason)     
