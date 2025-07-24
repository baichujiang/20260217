from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserBadge(Base):
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_type = Column(String, nullable=False)   
    level = Column(Integer, nullable=False)      
    progress = Column(Integer, default=0)         
    max_progress = Column(Integer)              

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
    badge_type = Column(String, nullable=False)         
    level = Column(Integer, nullable=False)            
    required_progress = Column(Integer, nullable=False) 
    name = Column(String, nullable=False)              
    description = Column(String, nullable=True)         
    icon = Column(String, nullable=True)                
    category = Column(String, nullable=False)           
