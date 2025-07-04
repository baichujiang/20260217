from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from ..core import database
from . import services, schemas
from ..core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# Register a new user
@router.post("/register", response_model=schemas.UserRead)
async def register(
        user: schemas.UserCreate,
        db: AsyncSession = Depends(database.get_db)
):
    return await services.create_user(db, user)

# Login and get access token
@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(
        form_data: OAuth2PasswordRequestForm = Depends(),
        db: AsyncSession = Depends(database.get_db)
):
    user = await services.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    token = create_access_token(data={"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

# Update avatar URL
@router.put("/avatar", response_model=schemas.UserRead)
async def set_avatar(
        avatar_url: str = Body(..., embed=True),
        user_id: int = Depends(services.get_current_user_id),
        db: AsyncSession = Depends(database.get_db)
):
    user = await services.set_user_avatar(db, user_id, avatar_url)
    return user

# Get the current user's profile (including avatar)
@router.get("/me", response_model=schemas.UserRead)
async def get_me(
        db: AsyncSession = Depends(database.get_db),
        user=Depends(services.get_current_user)
):
    return user
