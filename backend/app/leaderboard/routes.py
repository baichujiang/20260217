from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from . import service
from app.tree.schemas import UserOut

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/", response_model=List[UserOut])
async def get_leaderboard(
    period: str = Query("total"),
    db: AsyncSession = Depends(get_db)
):
    try:
        return await service.get_leaderboard(period, db)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid period")
