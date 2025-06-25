# points/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base, engine, get_db

class Point(Base):
    __tablename__ = "points"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)  # 正积分或负积分
    reason = Column(String, nullable=False)   # 来源原因，比如 "tree_created"
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="points")
