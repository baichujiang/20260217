from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
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

    gift_type = Column(String, nullable=False)

    submitted_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="rewards", lazy="joined")
    tree = relationship("Tree", lazy="joined")

class HarvestLog(Base):
    __tablename__ = "harvest_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    tree_id = Column(Integer, ForeignKey("trees.id"))
    timestamp = Column(DateTime, default=func.now())


from app.users.models import User  
