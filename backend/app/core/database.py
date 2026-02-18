from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings

# 必须用 asyncpg 驱动；若填的是 postgresql:// 会自动改为 postgresql+asyncpg://
database_url = settings.DATABASE_URL
if database_url.startswith("postgresql://") and not database_url.startswith("postgresql+asyncpg://"):
    database_url = "postgresql+asyncpg://" + database_url.split("://", 1)[1]

engine = create_async_engine(database_url, future=True, echo=True)
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

