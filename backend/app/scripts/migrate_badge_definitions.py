# app/badges/migrate_badge_definitions.py

import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import SQLAlchemyError
from ..core.database import AsyncSessionLocal
from ..badges.models import BadgeDefinition  

CSV_PATH = "./_data/badge_definitions.csv"

async def migrate_badge_definitions():
    print("[Migration] Reading CSV...")
    df = pd.read_csv(CSV_PATH)
    print(df.head())

    async with AsyncSessionLocal() as db:
        try:
            for _, row in df.iterrows():
                result = await db.execute(
                    select(BadgeDefinition).where(
                        BadgeDefinition.badge_type == row["badge_type"],
                        BadgeDefinition.level == row["level"]
                    )
                )
                existing = result.scalar_one_or_none()

                if existing:
                    existing.name = row["name"]
                    existing.description = row["description"]
                    existing.required_progress = row["required_progress"]
                    existing.icon = row["icon"]
                    existing.category = row["category"]
                    print(f"[Migration] Updated: {row['badge_type']} - Level {row['level']}")
                else:
                    new_def = BadgeDefinition(
                        badge_type=row["badge_type"],
                        level=row["level"],
                        name=row["name"],
                        description=row["description"],
                        required_progress=row["required_progress"],
                        icon=row["icon"],
                        category=row["category"]
                    )
                    db.add(new_def)
                    print(f"[Migration] Inserted: {row['badge_type']} - Level {row['level']}")

            await db.commit()
            print("[Migration] Badge definitions migration completed successfully.")

        except SQLAlchemyError as e:
            await db.rollback()
            print("[Migration] Failed:", e)
