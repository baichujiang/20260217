from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..core.database import Base

class UserCredentials(Base):
    __tablename__ = "user_credentials"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(ForeignKey("users.id"))
    hashed_password = Column(String)

    user = relationship("User", back_populates="credentials")