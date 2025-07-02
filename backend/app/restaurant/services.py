from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from .models import Restaurant
from .schemas import RestaurantCreate, RestaurantUpdate
from typing import Optional, List


async def create_restaurant(db: AsyncSession, restaurant: RestaurantCreate) -> Restaurant:
    db_restaurant = Restaurant(**restaurant.model_dump())
    db.add(db_restaurant)
    await db.commit()
    await db.refresh(db_restaurant)
    return db_restaurant


async def get_restaurant(db: AsyncSession, restaurant_id: int) -> Optional[Restaurant]:
    result = await db.execute(select(Restaurant).where(Restaurant.id == restaurant_id))
    return result.scalar_one_or_none()


async def get_restaurants(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Restaurant]:
    result = await db.execute(select(Restaurant).offset(skip).limit(limit))
    return result.scalars().all()


async def update_restaurant(
    db: AsyncSession,
    restaurant_id: int,
    update_data: RestaurantUpdate
) -> Optional[Restaurant]:
    result = await db.execute(select(Restaurant).where(Restaurant.id == restaurant_id))
    db_restaurant = result.scalar_one_or_none()
    if not db_restaurant:
        return None

    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(db_restaurant, field, value)

    await db.commit()
    await db.refresh(db_restaurant)
    return db_restaurant


async def delete_restaurant(db: AsyncSession, restaurant_id: int) -> bool:
    result = await db.execute(select(Restaurant).where(Restaurant.id == restaurant_id))
    db_restaurant = result.scalar_one_or_none()
    if not db_restaurant:
        return False

    await db.delete(db_restaurant)
    await db.commit()
    return True
