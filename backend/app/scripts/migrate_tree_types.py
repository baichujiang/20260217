import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update
from ..core.database import AsyncSessionLocal
from ..tree.models import TreeType  # 根据你项目路径调整
from sqlalchemy.exc import SQLAlchemyError

CSV_PATH = "./_data/tree_types.csv"

async def migrate_tree_types():
    print("[Migration] Reading CSV...")
    df = pd.read_csv(CSV_PATH)
    print(df.head())  # 打印前几行确认

    async with AsyncSessionLocal() as db:
        try:
            for _, row in df.iterrows():
                # 查询当前 species 是否已存在
                result = await db.execute(select(TreeType).where(TreeType.species == row["species"]))
                existing = result.scalar_one_or_none()

                if existing:
                    # 更新现有记录
                    existing.goal_growth_value = row["goal_growth_value"]
                    existing.image_src = row["image_src"]
                    print(f"[Migration] Updated: {row['species']}")
                else:
                    # 插入新记录
                    new_type = TreeType(
                        species=row["species"],
                        goal_growth_value=row["goal_growth_value"],
                        image_src=row["image_src"]
                    )
                    db.add(new_type)
                    print(f"[Migration] Inserted: {row['species']}")

            await db.commit()
            print("[Migration] Tree types migration completed successfully.")

        except SQLAlchemyError as e:
            await db.rollback()
            print("[Migration] Failed:", e)
