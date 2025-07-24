import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from ..core.database import AsyncSessionLocal
from ..restaurant.models import Restaurant

CSV_PATH = "./_data/munich_restaurants.csv"

async def migrate_restaurants():
    df = pd.read_csv(CSV_PATH, encoding="utf-8")

    async with AsyncSessionLocal() as db:
        try:
            # OPTIONAL: skip if already populated
            result = await db.execute(select(Restaurant))
            existing_restaurants = result.scalars().all()
            if existing_restaurants:
                print("[Migration] Restaurants already exist — skipping migration.")
                return

            for _, row in df.iterrows():
                restaurant = Restaurant(
                    name=row["name"],
                    address=row["address"],
                    website=row["website"],
                    normal_score=row["normal_score"] if pd.notna(row["normal_score"]) else None
                )
                db.add(restaurant)

            await db.commit()
            print(f"[Migration] {len(df)} restaurants migrated successfully.")

        except Exception as e:
            await db.rollback()
            print("[Migration] Failed:", e)
