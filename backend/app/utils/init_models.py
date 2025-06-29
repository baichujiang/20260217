from sqlalchemy.ext.asyncio import AsyncEngine
from ..auth import models as user_credentials_model
from ..users import models as users_model
from ..points import models as points_model
from ..tree import models as tree_model
from ..watering import models as watering_model
from ..review import models as review_model

async def init_models(engine: AsyncEngine):
    async with engine.begin() as conn:
        await conn.run_sync(user_credentials_model.Base.metadata.create_all)
        await conn.run_sync(users_model.Base.metadata.create_all)
        await conn.run_sync(points_model.Base.metadata.create_all)
        await conn.run_sync(tree_model.Base.metadata.create_all)
        await conn.run_sync(watering_model.Base.metadata.create_all)
        await conn.run_sync(review_model.Base.metadata.create_all)
