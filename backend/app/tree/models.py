# app/tree/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Tree(Base):
    __tablename__ = "trees"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type_id = Column(Integer, ForeignKey("tree_types.id"), nullable=False)
    name = Column(String, nullable=False)
    species = Column(String, nullable=False)
    growth_value = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="trees")
    watering_logs = relationship("WateringLog", back_populates="tree")
    type = relationship("TreeType", back_populates="trees")


class TreeType(Base):
    __tablename__ = "tree_types"

    id = Column(Integer, primary_key=True, index=True)
    species = Column(String, unique=True, nullable=False)
    goal_growth_value = Column(Integer, nullable=False)
    image_src = Column(String, nullable=False)

    trees = relationship("Tree", back_populates="type")


class WateringLog(Base):
    __tablename__ = "watering_logs"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tree_id = Column(Integer, ForeignKey("trees.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="watering_logs")
    tree = relationship("Tree", back_populates="watering_logs")
