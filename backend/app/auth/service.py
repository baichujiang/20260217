from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from . import models, schemas
from ..core import database
from ..core.security import verify_password, hash_password
from ..core.config import settings

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")

async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(models.User).where(models.User.username == username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

async def create_user(db: AsyncSession, user_data: schemas.UserCreate):
    user = models.User(
        username=user_data.username,
        hashed_password=hash_password(user_data.password)
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def get_current_user(token: str = Depends(oauth2_bearer), db: AsyncSession = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    result = await db.execute(select(models.User).where(models.User.username == username))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user
