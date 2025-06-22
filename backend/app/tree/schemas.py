# tree/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# ——— 1. 创建用：前端只传 type_id，不传 user_id（由 token 获取） ——— #
class TreeBase(BaseModel):
    type_id: int

class TreeCreate(TreeBase):
    pass

# ——— 2. 返回给前端用：包含完整品种信息 ——— #
class TreeTypeOut(BaseModel):
    id: int
    species: str
    goal_growth_value: int
    image_src: str

    class Config:
        orm_mode = True

# ✅ 修正后的 TreeTypeCreate：用于创建品种时接收前端字段
class TreeTypeCreate(BaseModel):
    species: str
    goal_growth_value: int
    image_src: str

# ——— 3. 内部使用的基础模型：包含 user_id ——— #
class TreeInDBBase(TreeBase):
    id: int
    user_id: int
    growth_value: int
    created_at: datetime

    class Config:
        orm_mode = True

# ——— 4. 对外返回树结构：嵌套品种信息 ——— #
class Tree(TreeInDBBase):
    type: TreeTypeOut
