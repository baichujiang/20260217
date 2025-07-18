from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from . import models, schemas
from app.points import service as point_service
from fastapi import HTTPException, status
from .models import WateringLog
from sqlalchemy.orm import selectinload
from app.badges.service import check_and_award_badges

async def create_tree(db: AsyncSession, user_id: int, tree_in: schemas.TreeCreate):
    stmt = select(models.TreeType).where(models.TreeType.id == tree_in.type_id)
    result = await db.execute(stmt)
    tree_type = result.scalar_one_or_none()
    if tree_type is None:
        raise HTTPException(status_code=404, detail="Tree type not found")

    new_tree = models.Tree(
        user_id=user_id,
        name=tree_type.species,
        species=tree_type.species,
        type=tree_type
    )
    db.add(new_tree)
    await db.commit()
    
    await point_service.add_points(
        db=db, user_id=user_id, amount=10, reason="tree_created"
    )

    return await get_tree(db, new_tree.id)

async def get_user_trees(db: AsyncSession, user_id: int):
    stmt = (
        select(models.Tree)
        .where(models.Tree.user_id == user_id)
        .order_by(models.Tree.created_at.desc())
        .options(selectinload(models.Tree.type))
    )
    result = await db.execute(stmt)
    return result.scalars().all()

async def get_tree(db: AsyncSession, tree_id: int):
    stmt = (
        select(models.Tree)
        .where(models.Tree.id == tree_id)
        .options(selectinload(models.Tree.type))
    )
    result = await db.execute(stmt)
    return result.scalars().first()

async def water_tree(db: AsyncSession, user_id: int, tree_id: int, amount: int):
    tree = await get_tree(db, tree_id)
    if not tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tree not found"
        )

    if tree.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized to water this tree"
        )

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

    tree.growth_value += amount
    log = WateringLog(user_id=user_id, tree_id=tree_id, amount=amount)
    db.add(log)
    await db.commit()
    await db.refresh(tree)
    await check_and_award_badges(user_id=user_id, db=db)

    return tree
