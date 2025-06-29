# backend/app/harvest/models.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base

class RewardDelivery(Base):
    __tablename__ = "reward_deliveries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tree_id = Column(Integer, ForeignKey("trees.id"), nullable=False)

    full_name = Column(String, nullable=False)
    street_address = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=True)
    phone_number = Column(String, nullable=False)

    submitted_at = Column(DateTime, default=datetime.utcnow)

    # 可选的关系字段（如果你后面需要联表查询）
    user = relationship("User", back_populates="rewards", lazy="joined")
    tree = relationship("Tree", lazy="joined")

from app.users.models import User  # ⬅ 放在文件结尾，避免循环引用
