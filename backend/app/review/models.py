from sqlalchemy import Column, Integer, Float, Text, DateTime, ForeignKey, Table, String
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..core.database import Base

review_tag_association = Table(
    "review_tag_association",
    Base.metadata,
    Column("review_id", Integer, ForeignKey("reviews.id")),
    Column("tag_id", Integer, ForeignKey("review_tags.id"))
)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    normal_rating = Column(Float, nullable=False)

    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    tags = relationship("ReviewTag", secondary=review_tag_association, back_populates="reviews")
    # user = relationship("User", back_populates="reviews")
    restaurant = relationship("Restaurant", back_populates="reviews")


class ReviewTag(Base):
    __tablename__ = "review_tags"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey("review_tag_categories.id"), nullable=False)

    category = relationship("ReviewTagCategory", back_populates="tags")
    reviews = relationship("Review", secondary=review_tag_association, back_populates="tags")


class ReviewTagCategory(Base):
    __tablename__ = "review_tag_categories"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    tags = relationship("ReviewTag", back_populates="category")
