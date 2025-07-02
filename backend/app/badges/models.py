from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_type = Column(String, nullable=False)   # e.g., "watering", "grower"
    level = Column(Integer, nullable=False)       # 1, 2, 3
    progress = Column(Integer, default=0)         # 当前进度
    max_progress = Column(Integer)                # 达到这个值即升级

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
    badge_type = Column(String, nullable=False)         # e.g., watering, grower, streak
    level = Column(Integer, nullable=False)             # e.g., 1, 2, 3
    required_progress = Column(Integer, nullable=False) # e.g., 10, 100, 1000
    name = Column(String, nullable=False)               # Badge name to show
    description = Column(String, nullable=True)         # Optional tooltip text
    icon = Column(String, nullable=True)                # Badge icon path
    category = Column(String, nullable=False)           # e.g., "Growth", "Activity"