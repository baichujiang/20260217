from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from ..core.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    avatar_url = Column(String, nullable=True)
    
    credentials = relationship("UserCredentials", back_populates="user", uselist=False, cascade="all, delete-orphan")

    trees = relationship("Tree", back_populates="user", cascade="all, delete-orphan")
    points = relationship("Point", back_populates="user", cascade="all, delete-orphan")
    watering_logs = relationship("WateringLog", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    rewards = relationship("RewardDelivery", back_populates="user")
    badges = relationship("UserBadge", back_populates="user", cascade="all, delete")
