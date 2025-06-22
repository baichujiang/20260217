from sqlalchemy.orm import Session
from . import models, schemas


def create_restaurant(db: Session, restaurant: schemas.RestaurantCreate) -> models.Restaurant:
    db_restaurant = models.Restaurant(**restaurant.model_dump())
    db.add(db_restaurant)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


def get_restaurant(db: Session, restaurant_id: int) -> models.Restaurant | None:
    return db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()


def get_restaurants(db: Session, skip: int = 0, limit: int = 100) -> list[models.Restaurant]:
    return db.query(models.Restaurant).offset(skip).limit(limit).all()


def update_restaurant(db: Session, restaurant_id: int, update_data: schemas.RestaurantUpdate) -> models.Restaurant | None:
    db_restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not db_restaurant:
        return None
    for field, value in update_data.dict(exclude_unset=True).items():
        setattr(db_restaurant, field, value)
    db.commit()
    db.refresh(db_restaurant)
    return db_restaurant


def delete_restaurant(db: Session, restaurant_id: int) -> bool:
    db_restaurant = db.query(models.Restaurant).filter(models.Restaurant.id == restaurant_id).first()
    if not db_restaurant:
        return False
    db.delete(db_restaurant)
    db.commit()
    return True
