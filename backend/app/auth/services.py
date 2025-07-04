from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer
from .models import UserCredentials
from ..users.models import User
from .schemas import UserCreate
from ..core import database
from ..core.security import verify_password, hash_password
from ..core.config import settings

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
    # Check if user exists
    result = await db.execute(select(User).where(User.username == user_data.username))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already taken")

    # Create User
    user = User(username=user_data.username)
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Create credentials
    credentials = UserCredentials(
        user_id=user.id,
        hashed_password=hash_password(user_data.password)
    )
    db.add(credentials)
    await db.commit()
    return user


async def authenticate_user(db: AsyncSession, username: str, password: str) -> User:
    result = await db.execute(
        select(User).where(User.username == username)
    )
    user = result.scalar_one_or_none()
    if not user:
        return None

    result = await db.execute(
        select(UserCredentials).where(UserCredentials.user_id == user.id)
    )
    credentials = result.scalar_one_or_none()

    if not credentials or not verify_password(password, credentials.hashed_password):
        return None

    return user


async def get_current_user(
        token: str = Depends(oauth2_bearer),
        db: AsyncSession = Depends(database.get_db)
) -> User:
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

    # Load User
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception

    # Load credentials to get avatar
    result = await db.execute(select(UserCredentials).where(UserCredentials.user_id == user.id))
    credentials = result.scalar_one_or_none()
    if credentials:
        user.avatar_url = credentials.avatar_url
    else:
        user.avatar_url = None

    return user



async def get_current_user_id(
        token: str = Depends(oauth2_bearer),
        db: AsyncSession = Depends(database.get_db)
) -> int:
    current_user = await get_current_user(token, db)
    return current_user.id


async def set_user_avatar(db: AsyncSession, user_id: int, avatar_url: str) -> User:
    # Fetch UserCredentials to update the avatar
    result = await db.execute(
        select(UserCredentials).where(UserCredentials.user_id == user_id)
    )
    credentials = result.scalar_one_or_none()
    if not credentials:
        raise HTTPException(status_code=404, detail="User credentials not found")

    credentials.avatar_url = avatar_url
    db.add(credentials)
    await db.commit()
    await db.refresh(credentials)

    # Load the User to return
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Dynamically attach avatar_url so your Pydantic schema can serialize it
    user.avatar_url = avatar_url

    return user
