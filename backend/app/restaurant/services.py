from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc, nulls_last
from .models import Restaurant
from .schemas import RestaurantCreate, RestaurantUpdate
from ..review.models import ReviewTag, review_tag_association, Review
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


async def search_restaurants_by_name(db: AsyncSession, query: str, limit: int = 10) -> List[Restaurant]:
    similarity = func.similarity(Restaurant.name, query)
    stmt = (
        select(Restaurant)
        .where(Restaurant.name.op('%')(query))  # uses pg_trgm fuzzy operator
        .order_by(similarity.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_top_tags_for_restaurant(session: AsyncSession, restaurant_id: int, limit: int = 5):
    stmt = (
        select(
            ReviewTag.name,
            ReviewTag.category,
            func.count(ReviewTag.id).label("count")
        )
        .select_from(review_tag_association)
        .join(ReviewTag, review_tag_association.c.tag_id == ReviewTag.id)
        .join(Review, review_tag_association.c.review_id == Review.id)
        .where(Review.restaurant_id == restaurant_id)
        .group_by(ReviewTag.id)
        .order_by(desc("count"))
        .limit(limit)
    )
    result = await session.execute(stmt)
    return result.all()

async def get_top_sustainable_restaurants(db: AsyncSession, limit: int = 5) -> List[Restaurant]:
    # 有 sustainability_score 的排前面，没有的用 normal_score 凑，保证首页有数据
    stmt = (
        select(Restaurant)
        .order_by(
            nulls_last(desc(Restaurant.sustainability_score)),
            nulls_last(desc(Restaurant.normal_score)),
        )
        .limit(limit)
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def update_score(db: AsyncSession, restaurant_id: int):
    stmt = select(
        func.avg(Review.normal_rating).label("normal_score"),
        func.avg(Review.food_rating).label("food_score"),
        func.avg(Review.service_rating).label("service_score"),
        func.avg(Review.environment_rating).label("environment_score"),
        func.avg(Review.sustainability_rating).label("sustainability_score"),
        func.avg(Review.sourcing_rating).label("sourcing_score"),
        func.avg(Review.waste_rating).label("waste_score"),
        func.avg(Review.menu_rating).label("menu_score"),
        func.avg(Review.energy_rating).label("energy_score")
    ).where(Review.restaurant_id == restaurant_id)

    result = await db.execute(stmt)
    scores = result.mappings().one_or_none()

    if scores:
        restaurant_stmt = select(Restaurant).where(Restaurant.id == restaurant_id)
        restaurant_result = await db.execute(restaurant_stmt)
        restaurant = restaurant_result.scalar_one_or_none()

        if restaurant:
            restaurant.normal_score = scores["normal_score"]
            restaurant.food_score = scores["food_score"]
            restaurant.service_score = scores["service_score"]
            restaurant.environment_score = scores["environment_score"]
            restaurant.sustainability_score = scores["sustainability_score"]
            restaurant.sourcing_score = scores["sourcing_score"]
            restaurant.waste_score = scores["waste_score"]
            restaurant.menu_score = scores["menu_score"]
            restaurant.energy_score = scores["energy_score"]

            await db.commit()
            await db.refresh(restaurant)
