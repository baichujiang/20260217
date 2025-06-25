# app/tree/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime   # 字段类型
from sqlalchemy.orm import relationship                                # 外键关联
from datetime import datetime
from app.core.database import Base                                     # 引入 Base

class Tree(Base):
    __tablename__ = "trees"                                            # 表名为 trees

    id = Column(Integer, primary_key=True, index=True)                 # 主键 ID
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False) # 外键关联用户
    type_id = Column(Integer, ForeignKey("tree_types.id"), nullable=False)  # 新增外键关联树种类表
    name = Column(String, nullable=False)                              # 树的名字
    species = Column(String, nullable=False)                           # 树的种类
    growth_value = Column(Integer, default=0)                          # 成长值，初始为 0
    created_at = Column(DateTime, default=datetime.utcnow)            # 创建时间（自动）

    user = relationship("User", back_populates="trees")               # ORM 关系，反向引用用户
    watering_logs = relationship("WateringLog", back_populates="tree")
    type = relationship("TreeType", back_populates="trees")  # 新增


class TreeType(Base):
    __tablename__ = "tree_types"

    id                = Column(Integer, primary_key=True, index=True)
    species           = Column(String, unique=True, nullable=False)
    goal_growth_value = Column(Integer, nullable=False)
    image_src         = Column(String, nullable=False)

    # 反向关系（可选）
    trees             = relationship("Tree", back_populates="type")

