from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .auth.routes import router as auth_router
from .restaurant.routes import router as restaurant_router
from .core.database import engine
from .utils.init_models import init_models
from .core.config import settings
from .scripts.migrate_restaurants import migrate_restaurants

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Startup] Verifying/Creating database tables...")
    await init_models(engine)
    print("[Startup] Migrating restaurant data...")
    await migrate_restaurants()

    yield

    print("[Shutdown]")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 写上前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(restaurant_router)

@app.get("/")
async def root():
    return {"message": "Welcome to LeafMiles"}
