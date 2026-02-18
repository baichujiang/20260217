from sqlalchemy.ext.asyncio import AsyncEngine
from sqlalchemy import text

# 导入所有 model，让 Base.metadata 里注册所有表（表结构在代码里）
from ..auth import models as auth_models
from ..users import models as users_models
from ..points import models as points_models
from ..tree import models as tree_models
from ..review import models as review_models
from ..restaurant import models as restaurant_models
from ..badges import models as badges_models
from ..harvest import models as harvest_models
from ..checkin import models as checkin_models

from ..core.database import Base

async def init_models(engine: AsyncEngine):
    async with engine.begin() as conn:
        # 若数据库无权限创建扩展可忽略（如 Render 托管 Postgres）
        try:
            await conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm;"))
        except Exception:
            pass
        # 一次性创建所有已注册的表（users, trees, restaurants, reviews, badges, harvest, checkin 等）
        await conn.run_sync(Base.metadata.create_all)
