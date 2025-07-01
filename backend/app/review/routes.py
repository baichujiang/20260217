from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession


from .schemas import ReviewCreate, ReviewRead
from .services import create_review, get_review, get_reviews_by_user, get_reviews_by_restaurant, delete_review
from ..auth.services import get_current_user_id
from ..core.database import get_db


router = APIRouter(prefix="/reviews", tags=["Reviews"])

@router.post("/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
async def create_review_route(
    review_data: ReviewCreate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await create_review(db, review_data, user_id)

@router.get("/{review_id}", response_model=ReviewRead)
async def get_review(
    review_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    review = get_review(db, review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return await review

@router.get("/user/me", response_model=List[ReviewRead])
async def get_reviews_by_current_user(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db)
):
    return await get_reviews_by_user(db, user_id)

@router.get("/restaurant/{restaurant_id}", response_model=List[ReviewRead])
async def get_reviews_by_restaurant_route(
    restaurant_id: int,
    db: AsyncSession = Depends(get_db)
):
    return await get_reviews_by_restaurant(db, restaurant_id)

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
