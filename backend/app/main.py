from fastapi import Depends, FastAPI

from .auth.routes import router as auth_router
from .core.database import engine, Base

from app.tree.routes import router as tree_router
from app.points.routes import router as points_router
from app.auth import models as auth_models
from app.users.routes import router as users_router
from app.watering.routes import router as watering_router
from app.harvest import models as harvest_models
from app.harvest.routes import router as harvest_router


from fastapi.middleware.cors import CORSMiddleware  # 导入 CORS 中间件

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 写上前端地址
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

@app.get("/")
async def root():
    return {"message": "Welcome to LeafMiles"}

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        """ await conn.run_sync(Base.metadata.drop_all)    # ⚠️ 会清空所有表结构 """
        await conn.run_sync(Base.metadata.create_all)
