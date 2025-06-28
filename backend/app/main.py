from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.tree.routes import router as tree_router
from app.points.routes import router as points_router
from app.users.routes import router as users_router
from app.watering.routes import router as watering_router

from app.core.database import engine, Base  # shared database

app = FastAPI()

# ✅ CORS: Allow frontend to connect to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include all API routers
app.include_router(auth_router)        # /auth/register, /auth/token, etc.
app.include_router(tree_router)        # /trees/...
app.include_router(points_router)      # /points/...
app.include_router(users_router)       # /users/...
app.include_router(watering_router)    # /watering/...

# ✅ Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to LeafMiles"}

# ✅ On startup: create database tables
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # Uncomment the next line to drop all tables each time (⚠️ DANGEROUS in prod)
        # await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
