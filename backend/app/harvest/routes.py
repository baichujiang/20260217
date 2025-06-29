from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime

from app.core.database import get_db
from app.auth.services import get_current_user
from app.harvest.schemas import HarvestRewardRequest
from app.tree.models import Tree
from app.harvest.models import RewardDelivery
from app.users.models import User

router = APIRouter()

@router.get("/harvest/me/rewards")
async def get_my_rewards(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(RewardDelivery)
        .where(RewardDelivery.user_id == current_user.id)
        .order_by(RewardDelivery.submitted_at.desc())
    )
    return result.scalars().all()


@router.post("/trees/{tree_id}/harvest")
async def harvest_tree(
    tree_id: int,
    data: HarvestRewardRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 查询树，并带上关联的 type（避免 lazy load 报错）
    result = await db.execute(
        select(Tree).options(selectinload(Tree.type)).where(Tree.id == tree_id)
    )
    tree = result.scalar_one_or_none()
    if not tree:
        raise HTTPException(status_code=404, detail="Tree not found")

    # 确保是当前用户的树
    if tree.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You cannot harvest someone else's tree.")

    # 检查是否满足收获条件
    if tree.growth_value < tree.type.goal_growth_value:
        raise HTTPException(status_code=400, detail="Tree is not ready for harvest.")

    # 创建奖励记录
    reward = RewardDelivery(
        user_id=current_user.id,
        tree_id=tree_id,
        full_name=data.full_name,
        street_address=data.street_address,
        postal_code=data.postal_code,
        city=data.city,
        state=data.state,
        phone_number=data.phone_number,
        submitted_at=datetime.utcnow(),
    )
    db.add(reward)

    # 重置成长值
    tree.growth_value = 0
    db.add(tree)

    await db.commit()
    await db.refresh(tree)

    return tree
