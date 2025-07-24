from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.database import engine
from .utils.init_models import init_models
from .core.config import settings
from .scripts.migrate_restaurants import migrate_restaurants
from .scripts.migrate_tree_types import migrate_tree_types  
from .scripts.migrate_badge_definitions import migrate_badge_definitions

from .restaurant.routes import router as restaurant_router
from app.auth.routes import router as auth_router
from app.tree.routes import router as tree_router
from app.points.routes import router as points_router
from app.users.routes import router as users_router
from app.harvest.routes import router as harvest_router
from app.badges.routes import router as badges_router
from app.checkin.routes import router as checkin_router

from .scripts.migrate_review_tags import migrate_review_tags

from .restaurant.routes import router as restaurant_router
from .auth.routes import router as auth_router
from .tree.routes import router as tree_router
from .points.routes import router as points_router
from .users.routes import router as users_router
from .harvest.routes import router as harvest_router
from .review.routes import router as review_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[Startup] Verifying/Creating database tables...")
    await init_models(engine)
    print("[Startup] Migrating restaurant data...")
    await migrate_restaurants()
    print("[Startup] Migrating tree types data...")
    await migrate_tree_types()
    print("[Startup] Migrating badge definitions...")
    await migrate_badge_definitions()   
    print("[Startup] Migrating review tags...")
    await migrate_review_tags()

    yield

    print("[Shutdown]")

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tree_router)
app.include_router(points_router)
app.include_router(users_router)
app.include_router(harvest_router)
app.include_router(restaurant_router)
app.include_router(badges_router)
app.include_router(review_router)
app.include_router(checkin_router)

@app.get("/")
async def root():
    return {"message": "Welcome to LeafMiles"}
