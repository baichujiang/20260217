from fastapi import Depends, FastAPI

from .auth.routes import router as auth_router
from .core.database import engine, Base

app = FastAPI()

app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "Welcome to LeafMiles"}

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)