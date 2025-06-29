from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from ..core.database import Base

class Restaurant(Base):
    __tablename__ = "restaurants"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(String)
    website = Column(String)
    normal_score = Column(Float)
    sustainability_score = Column(Float)
    sourcing_score = Column(Float)
    waste_score = Column(Float)
    menu_score = Column(Float)
    energy_score = Column(Float)

    reviews = relationship("Review", back_populates="restaurant")