from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.database import engine
from .utils.init_models import init_models
from .core.config import settings
from .scripts.migrate_restaurants import migrate_restaurants

from .restaurant.routes import router as restaurant_router
from app.auth.routes import router as auth_router
from app.tree.routes import router as tree_router
from app.points.routes import router as points_router
from app.users.routes import router as users_router
from app.watering.routes import router as watering_router
from app.harvest.routes import router as harvest_router
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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tree_router)
app.include_router(points_router)
app.include_router(users_router)
app.include_router(watering_router)
app.include_router(harvest_router)
app.include_router(restaurant_router)

@app.get("/")
async def root():
    return {"message": "Welcome to LeafMiles"}
