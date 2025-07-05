import json
from fastapi import APIRouter, Depends, Form, HTTPException, Request, status, File, UploadFile
from fastapi.responses import JSONResponse
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID

from .utils import build_image_response, map_review_to_reviewread_schema

from .schemas import ReviewCreate, ReviewRead, ReviewTagRead, ReviewCommentRead, ReviewImageRead
from .services import (
    create_review,
    get_review,
    get_review_images_by_review,
    get_reviews_by_user,
    get_reviews_by_restaurant,
    delete_review,
    get_all_review_tags,
    get_comments_by_restaurant,
    save_and_create_review_image,
    get_review_images_by_restaurant
)
from ..auth.services import get_current_user_id
from ..core.database import get_db


router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.post("/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
async def create_review_route(
    restaurant_id: int = Form(...),
    normal_rating: int = Form(...),
    food_rating: int = Form(...),
    service_rating: int = Form(...),
    environment_rating: int = Form(...),
    sustainablility_rating: int = Form(...),
    sourcing_rating: int = Form(...),
    waste_rating: int = Form(...),
    menu_rating: int = Form(...),
    energy_rating: int = Form(...),
    comment: Optional[str] = Form(None),
    tag_ids: Optional[str] = Form("[]"),
    files: List[UploadFile] = File([]),
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    try:
        review_data = ReviewCreate(
            restaurant_id=restaurant_id,
            normal_rating=normal_rating,
            food_rating=food_rating,
            service_rating=service_rating,
            environment_rating=environment_rating,
            sustainablility_rating=sustainablility_rating,
            sourcing_rating=sourcing_rating,
            waste_rating=waste_rating,
            menu_rating=menu_rating,
            energy_rating=energy_rating,
            comment=comment,
            tag_ids=json.loads(tag_ids),
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid form data: {str(e)}")

    try:
        review = await create_review(db, review_data, user_id)
        for file in files:
            await save_and_create_review_image(db, review.id, file)
        await db.commit()
        return map_review_to_reviewread_schema(review, request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save review: {str(e)}")


@router.get("/tags", response_model=List[ReviewTagRead])
async def get_all_review_tags_route(db: AsyncSession = Depends(get_db)):
    return await get_all_review_tags(db)


@router.get("/{review_id}", response_model=ReviewRead)
async def get_review_route(
    review_id: UUID,
    db: AsyncSession = Depends(get_db),
    request: Request = None,
):
    review = await get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return map_review_to_reviewread_schema(review, request)


@router.get("/{review_id}/images", response_model=List[ReviewImageRead])
async def get_images_for_review(
    review_id: UUID,
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    images = await get_review_images_by_review(db, review_id)

    if not images:
        raise HTTPException(status_code=404, detail="No images found for this review")

    return [ReviewImageRead(**build_image_response(img, request)) for img in images]


@router.get("/user/me", response_model=List[ReviewRead])
async def get_reviews_by_current_user(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    reviews = await get_reviews_by_user(db, user_id)
    return [map_review_to_reviewread_schema(r, request) for r in reviews]


@router.get("/restaurant/{restaurant_id}", response_model=List[ReviewRead])
async def get_reviews_by_restaurant_route(
    restaurant_id: int,
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    reviews = await get_reviews_by_restaurant(db, restaurant_id)
    return [map_review_to_reviewread_schema(r, request) for r in reviews]


@router.get("/restaurant/{restaurant_id}/comments", response_model=List[ReviewCommentRead])
async def get_comments(
    restaurant_id: int,
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    return await get_comments_by_restaurant(db, restaurant_id, request)


@router.get("/restaurant/{restaurant_id}/images", response_model=List[ReviewImageRead])
async def get_review_images_route(
    restaurant_id: int,
    db: AsyncSession = Depends(get_db),
    request: Request = None
):
    images = await get_review_images_by_restaurant(db, restaurant_id)
    return [build_image_response(img, request) for img in images]


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review_route(
    review_id: UUID,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    success = await delete_review(db, review_id, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found or not authorized")
    return JSONResponse(
        content={"message": "Review deleted successfully"},
        status_code=200
    )
