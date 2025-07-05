from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_type = Column(String, nullable=False)   # e.g., "watering", "harvest", "reviewer"
    level = Column(Integer, nullable=False)       # Level 1, 2, 3
    progress = Column(Integer, default=0)         # 当前进度（由后端动态更新）
    max_progress = Column(Integer)                # 达到此进度即解锁该等级

    user = relationship("User", back_populates="badges")
    definition = relationship(
        "BadgeDefinition",
        primaryjoin="and_(UserBadge.badge_type==foreign(BadgeDefinition.badge_type), "
                    "UserBadge.level==foreign(BadgeDefinition.level))",
        uselist=False,
        lazy="joined",
    )

class BadgeDefinition(Base):
    __tablename__ = "badge_definitions"

    id = Column(Integer, primary_key=True, index=True)
    badge_type = Column(String, nullable=False)         # e.g., watering, harvest, reviewer
    level = Column(Integer, nullable=False)             # Level 1, 2, 3
    required_progress = Column(Integer, nullable=False) # 达到该值后解锁
    name = Column(String, nullable=False)               # 显示的徽章名称
    description = Column(String, nullable=True)         # 可选描述
    icon = Column(String, nullable=True)                # 显示图标路径
    category = Column(String, nullable=False)           # 前端分组显示用途，例如 "Activity", "Growth"
