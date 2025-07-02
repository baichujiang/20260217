# app/gifts/routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from ..core.database import get_db
from ..auth.dependencies import get_current_user
from .models import Gift
from .schemas import GiftSchema

router = APIRouter(prefix="/gifts", tags=["Gifts"])

@router.get("/", response_model=list[GiftSchema])
async def get_my_gifts(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(
        select(Gift).where(Gift.user_id == current_user.id)
    )
    return result.scalars().all()
