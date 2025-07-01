import pandas as pd
from sqlalchemy.future import select

from ..core.database import AsyncSessionLocal
from ..review.models import ReviewTag

CSV_PATH = "./_data/review_tags.csv"

async def migrate_review_tags():
    df = pd.read_csv(CSV_PATH, encoding="utf-8")

    async with AsyncSessionLocal() as db:
        try:
            # OPTIONAL: skip if already populated
            result = await db.execute(select(ReviewTag))
            existing_tags = result.scalars().all()
            if existing_tags:
                print("[Migration] Review tags already exist — skipping migration.")
                return

            for _, row in df.iterrows():
                tag = ReviewTag(
                    id=int(row["id"]),
                    name=row["name"].strip(),
                    category=row["category"].strip()  # or TagCategory(row["category"].strip())
                )
                db.add(tag)

            await db.commit()
            print(f"[Migration] {len(df)} review tags migrated successfully.")

        except Exception as e:
            await db.rollback()
            print("[Migration] Failed:", e)
