from fastapi import HTTPException, status
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from .config import settings

# bcrypt 只接受最多 72 字节，统一在此截断
def _to_bcrypt_secret(password: str) -> bytes:
    raw = password.encode("utf-8")
    return raw[:72] if len(raw) > 72 else raw

def hash_password(password: str) -> str:
    secret = _to_bcrypt_secret(password)
    return bcrypt.hashpw(secret, bcrypt.gensalt()).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    secret = _to_bcrypt_secret(plain_password)
    return bcrypt.checkpw(secret, hashed_password.encode("utf-8"))

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
