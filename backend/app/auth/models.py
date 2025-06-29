from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # ✅ Relationships to other models
    trees = relationship("Tree", back_populates="user", cascade="all, delete-orphan")
    points = relationship("Point", back_populates="user", cascade="all, delete-orphan")
    watering_logs = relationship("WateringLog", back_populates="user", cascade="all, delete-orphan")
    rewards = relationship("RewardDelivery", back_populates="user")

# app/auth/models.py 末尾加：
from app.harvest.models import RewardDelivery  # 避免 circular import 但确保 SQLAlchemy 注册到这个类
