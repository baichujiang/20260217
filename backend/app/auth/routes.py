from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from . import schemas, service
from ..core import database
from ..core.security import create_access_token
from .models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserRead)
async def register(user_create: schemas.UserCreate, db: AsyncSession = Depends(database.get_db)):
    existing_user = await service.get_user_by_username(db, user_create.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    user = await service.create_user(db, user_create)
    return user

@router.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(database.get_db)):
    user = await service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}
