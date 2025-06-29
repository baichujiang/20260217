from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models, schemas
from typing import Optional, List


async def create_restaurant(db: AsyncSession, restaurant: schemas.RestaurantCreate) -> models.Restaurant:
    db_restaurant = models.Restaurant(**restaurant.model_dump())
    db.add(db_restaurant)
    await db.commit()
    await db.refresh(db_restaurant)
    return db_restaurant


async def get_restaurant(db: AsyncSession, restaurant_id: int) -> Optional[models.Restaurant]:
    result = await db.execute(select(models.Restaurant).where(models.Restaurant.id == restaurant_id))
    return result.scalar_one_or_none()


async def get_restaurants(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[models.Restaurant]:
    result = await db.execute(select(models.Restaurant).offset(skip).limit(limit))
    return result.scalars().all()


async def update_restaurant(
    db: AsyncSession,
    restaurant_id: int,
    update_data: schemas.RestaurantUpdate
) -> Optional[models.Restaurant]:
    result = await db.execute(select(models.Restaurant).where(models.Restaurant.id == restaurant_id))
    db_restaurant = result.scalar_one_or_none()
    if not db_restaurant:
        return None

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(db_restaurant, field, value)

    await db.commit()
    await db.refresh(db_restaurant)
    return db_restaurant


async def delete_restaurant(db: AsyncSession, restaurant_id: int) -> bool:
    result = await db.execute(select(models.Restaurant).where(models.Restaurant.id == restaurant_id))
    db_restaurant = result.scalar_one_or_none()
    if not db_restaurant:
        return False

    await db.delete(db_restaurant)
    await db.commit()
    return True
