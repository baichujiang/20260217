from fastapi import Depends, FastAPI
from contextlib import asynccontextmanager

from .auth.routes import router as auth_router
from .restaurant.routes import router as restaurant_router
from .core.database import engine
from .auth import models as user_model
from .restaurant import models as restaurant_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    print("[Startup] Verifying/Creating database tables...")
    user_model.Base.metadata.create_all(bind=engine)
    restaurant_model.Base.metadata.create_all(bind=engine)

    yield

    print("[Shutdown]")

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(restaurant_router)

@app.get("/")
async def root():
    return {"message": "Welcome to LeafMiles"}