from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    # ✅ 一对多关系：一个用户可以有多棵树和多条积分记录
    trees = relationship("Tree", back_populates="user", cascade="all, delete-orphan")
    points = relationship("Point", back_populates="user", cascade="all, delete-orphan")
    watering_logs = relationship("WateringLog", back_populates="user", cascade="all, delete-orphan")
    rewards = relationship("RewardDelivery", back_populates="user")

# app/auth/models.py 末尾加：
from app.harvest.models import RewardDelivery  # 避免 circular import 但确保 SQLAlchemy 注册到这个类
