from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from uuid import UUID
from typing import List, Optional

from .models import Review, ReviewImage, ReviewTag
from .schemas import ReviewCreate, ReviewImageCreate, ReviewTagCreate, ReviewCommentRead


# --- REVIEW CRUD ---
async def create_review(db: AsyncSession, data: ReviewCreate, user_id: int) -> Review:
    review = Review(
        user_id=user_id,
        restaurant_id=data.restaurant_id,
        normal_rating=data.normal_rating,
        food_rating=data.food_rating,
        service_rating=data.service_rating,
        environment_rating=data.environment_rating,
        sustainablility_rating=data.sustainablility_rating,
        sourcing_rating=data.sourcing_rating,
        waste_rating=data.waste_rating,
        menu_rating=data.menu_rating,
        energy_rating=data.energy_rating,
        comment=data.comment
    )

    if data.tag_ids:
        stmt = select(ReviewTag).where(ReviewTag.id.in_(data.tag_ids))
        result = await db.execute(stmt)
        tags = result.scalars().all()
        review.tags.extend(tags)

    db.add(review)
    await db.commit()

    stmt = (
        select(Review)
        .where(Review.id == review.id)
        .options(
            selectinload(Review.tags),
            selectinload(Review.images)
        )
    )
    result = await db.execute(stmt)
    review_with_relations = result.scalar_one()
    return review_with_relations


async def get_review(db: AsyncSession, review_id: UUID) -> Optional[Review]:
    stmt = select(Review).where(Review.id == review_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_reviews_by_user(db: AsyncSession, user_id: int) -> List[Review]:
    stmt = select(Review).where(Review.user_id == user_id)
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_reviews_by_restaurant(db: AsyncSession, restaurant_id: int) -> List[Review]:
    stmt = (
        select(Review)
        .where(Review.restaurant_id == restaurant_id)
        .options(
            selectinload(Review.tags),
            selectinload(Review.images),
        )
    )
    result = await db.execute(stmt)
    return result.scalars().all()


async def get_comments_by_restaurant(db: AsyncSession, restaurant_id: int) -> List[ReviewCommentRead]:
    stmt = (
        select(Review)
        .where(Review.restaurant_id == restaurant_id)
        .options(
            selectinload(Review.tags),
            selectinload(Review.images),
            selectinload(Review.user)
        )
    )
    result = await db.execute(stmt)
    reviews = result.scalars().all()

    comments = [
        ReviewCommentRead(
            review_id=review.id,
            user_name=review.user.username,
            created_at=review.created_at.date().isoformat(),
            comment=review.comment or ""
        )
        for review in reviews if review.comment
    ]
    return comments


async def delete_review(db: AsyncSession, review_id: UUID, user_id: int) -> bool:
    stmt = select(Review).where(Review.id == review_id)
    result = await db.execute(stmt)
    review = result.scalar_one_or_none()
    if not review:
        return False
    
    if review.user_id != user_id:
        return False

    await db.delete(review)
    await db.commit()
    return True


# --- REVIEW TAG SERVICES ---
async def create_review_tag(db: AsyncSession, data: ReviewTagCreate) -> ReviewTag:
    tag = ReviewTag(id=data.id, name=data.name, category=data.category)
    db.add(tag)
    await db.commit()
    await db.refresh(tag)
    return tag


async def get_all_review_tags(db: AsyncSession) -> List[ReviewTag]:
    result = await db.execute(select(ReviewTag))
    return result.scalars().all()


# --- REVIEW IMAGE SERVICES ---
async def create_review_image(db: AsyncSession, data: ReviewImageCreate) -> ReviewImage:
    image = ReviewImage(review_id=data.review_id, file_path=data.file_path)
    db.add(image)
    await db.commit()
    await db.refresh(image)
    return image


async def get_images_by_review(db: AsyncSession, review_id: UUID) -> List[ReviewImage]:
    stmt = select(ReviewImage).where(ReviewImage.review_id == review_id)
    result = await db.execute(stmt)
    return result.scalars().all()
