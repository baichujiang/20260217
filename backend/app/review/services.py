import uuid
from fastapi import HTTPException, Request, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from uuid import UUID
from typing import List, Optional

from .models import Review, ReviewImage, ReviewTag
from .schemas import ReviewCreate, ReviewImageRead, ReviewTagCreate, ReviewCommentRead
from ..restaurant.services import update_score
from ..points.service import add_points
from ..core.supabase_client import supabase


# --- REVIEW CRUD ---
async def create_review(db: AsyncSession, data: ReviewCreate, user_id: int) -> Review:
    review = Review(
        user_id=user_id,
        restaurant_id=data.restaurant_id,
        normal_rating=data.normal_rating,
        food_rating=data.food_rating,
        service_rating=data.service_rating,
        environment_rating=data.environment_rating,
        sustainability_rating=data.sustainability_rating,
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
    await db.flush()

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

    await update_score(db, data.restaurant_id)

    await add_points(db, user_id, 3, "review")

    return review_with_relations


async def get_review(db: AsyncSession, review_id: UUID) -> Review:
    stmt = (
        select(Review)
        .where(Review.id == review_id)
        .options(selectinload(Review.images), selectinload(Review.tags))
    )
    result = await db.execute(stmt)
    return result.scalar_one()


async def get_reviews_by_user(db: AsyncSession, user_id: int) -> List[Review]:
    stmt = (
        select(Review)
        .options(
            selectinload(Review.tags),
            selectinload(Review.images)
        )
        .where(Review.user_id == user_id)
    )
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


async def get_comments_by_restaurant(
    db: AsyncSession, restaurant_id: int
) -> List[ReviewCommentRead]:
    from .utils import build_image_response
    stmt = (
        select(Review)
        .where(Review.restaurant_id == restaurant_id)
        .options(
            selectinload(Review.tags),
            selectinload(Review.images),
            selectinload(Review.user),
        )
    )
    result = await db.execute(stmt)
    reviews = result.scalars().all()

    comments = []
    for review in reviews:
        if not review.comment:
            continue
        comment = ReviewCommentRead(
            review_id=review.id,
            user_name=review.user.username,
            avatar_url=review.user.avatar_url,
            created_at=review.created_at.date().isoformat(),
            comment=review.comment,
            normal_rating=review.normal_rating,
            sustainability_rating=review.sustainability_rating,
            images=[ReviewImageRead(**build_image_response(img)) for img in review.images],
        )
        comments.append(comment)

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
SUPABASE_BUCKET = "leafmiles-review-images"
SIGNED_URL_EXPIRY = 3600

async def save_and_create_review_image(session: AsyncSession, review_id: UUID, file: UploadFile) -> ReviewImage:
    ext = file.filename.split(".")[-1]
    image_id = uuid.uuid4()
    filename = f"{review_id}/{image_id}.{ext}"

    try:
        # Read file content
        file_data = await file.read()

        # Upload to Supabase Storage
        response = supabase.storage.from_(SUPABASE_BUCKET).upload(filename, file_data)

        # Create DB record
        new_image = ReviewImage(id=image_id, review_id=review_id, file_path=filename)
        session.add(new_image)
        await session.flush()
        await session.refresh(new_image)

        return new_image

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to upload image. " + str(e))


async def get_review_images_by_restaurant(db: AsyncSession, restaurant_id: int, limit: int) -> List[ReviewImage]:
    stmt = (
        select(Review)
        .where(Review.restaurant_id == restaurant_id)
        .options(selectinload(Review.images))
    )
    result = await db.execute(stmt)
    reviews = result.scalars().all()

    all_images = []
    for review in reviews:
        for image in review.images:
            all_images.append(image)
            if len(all_images) == limit:
                return all_images

    return all_images


async def get_review_images_by_review(db: AsyncSession, review_id: UUID) -> List[ReviewImage]:
    stmt = (
        select(Review)
        .where(Review.id == review_id)
        .options(selectinload(Review.images))
    )
    result = await db.execute(stmt)
    review = result.scalar_one_or_none()

    if review is None:
        return []

    return await review.images


def get_public_url(path: str) -> str:
    result = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(path)
    if "error" in result and result["error"]:
        raise HTTPException(status_code=500, detail="Failed to generate signed URL: " + result["error"]["message"])
    return result
