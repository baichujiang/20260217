from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from . import schemas, services

router = APIRouter(prefix="/restaurants", tags=["Restaurants"])


@router.post("/", response_model=schemas.RestaurantOut, status_code=status.HTTP_201_CREATED)
async def create_restaurant(
    restaurant: schemas.RestaurantCreate,
    db: AsyncSession = Depends(get_db)
):
    return await services.create_restaurant(db, restaurant)


@router.get("/{restaurant_id}", response_model=schemas.RestaurantOut)
async def read_restaurant(
    restaurant_id: int,
    db: AsyncSession = Depends(get_db)
):
    db_restaurant = await services.get_restaurant(db, restaurant_id)
    if db_restaurant is None:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return db_restaurant


@router.get("/", response_model=list[schemas.RestaurantOut])
async def list_restaurants(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    return await services.get_restaurants(db, skip=skip, limit=limit)


@router.put("/{restaurant_id}", response_model=schemas.RestaurantOut)
async def update_restaurant(
    restaurant_id: int,
    restaurant: schemas.RestaurantUpdate,
    db: AsyncSession = Depends(get_db)
):
    db_restaurant = await services.update_restaurant(db, restaurant_id, restaurant)
    if db_restaurant is None:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return db_restaurant


@router.delete("/{restaurant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_restaurant(
    restaurant_id: int,
    db: AsyncSession = Depends(get_db)
):
    success = await services.delete_restaurant(db, restaurant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Restaurant not found")
