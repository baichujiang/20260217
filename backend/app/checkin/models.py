from sqlalchemy import Column, Integer, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from ..core.database import Base  # 你项目中用于声明模型基类

class DailyCheckin(Base):
    __tablename__ = "daily_checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    date = Column(Date, index=True)  # 签到日期

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="unique_user_date_checkin"),
    )
