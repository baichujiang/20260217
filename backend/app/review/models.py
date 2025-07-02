import uuid
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey, Table, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime, timezone
from ..core.database import Base

review_tag_association = Table(
    "review_tag_association",
    Base.metadata,
    Column("review_id", UUID, ForeignKey("reviews.id")),
    Column("tag_id", Integer, ForeignKey("review_tags.id"))
)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)

    normal_rating = Column(Integer, nullable=False)
    food_rating = Column(Integer, nullable=False)
    service_rating = Column(Integer, nullable=False)
    environment_rating = Column(Integer, nullable=False)

    sustainablility_rating = Column(Integer, nullable=False)
    sourcing_rating = Column(Integer, nullable=False)
    waste_rating = Column(Integer, nullable=False)
    menu_rating = Column(Integer, nullable=False)
    energy_rating = Column(Integer, nullable=False)

    comment = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    tags = relationship("ReviewTag", secondary=review_tag_association, back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    restaurant = relationship("Restaurant", back_populates="reviews")
    images = relationship("ReviewImage", back_populates="review", cascade="all, delete-orphan")


class ReviewTag(Base):
    __tablename__ = "review_tags"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=False)

    reviews = relationship("Review", secondary=review_tag_association, back_populates="tags")

class ReviewImage(Base):
    __tablename__ = "review_images"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    review_id = Column(UUID(as_uuid=True), ForeignKey("reviews.id"), nullable=False)
    file_path = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    review = relationship("Review", back_populates="images")
