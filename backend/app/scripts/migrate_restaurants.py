import pandas as pd
from sqlalchemy.orm import Session
from ..core.database import SessionLocal
from ..restaurant.models import Restaurant

CSV_PATH = "../../_data/munich_restaurants.csv"

def migrate_data():
    df = pd.read_csv(CSV_PATH)

    df = df[["name", "address", "website", "normal_score"]].dropna(subset=["name", "address", "website"])

    db: Session = SessionLocal()
    try:
        for _, row in df.iterrows():
            restaurant = Restaurant(
                name=row["name"],
                address=row["address"],
                website=row["website"],
                normal_score=row["normal_score"]
            )
            db.add(restaurant)
        db.commit()
        print(f"{len(df)} restaurants migrated successfully.")
    except Exception as e:
        db.rollback()
        print("Migration failed:", e)
    finally:
        db.close()

if __name__ == "__main__":
    migrate_data()
