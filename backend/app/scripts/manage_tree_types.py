# scripts/manage_tree_types.py

import asyncio
import argparse
from sqlalchemy import select
from app.core.database import SessionLocal as async_session_maker
from app.tree.models import TreeType
from app.users.models import User  
from app.watering.models import WateringLog  
from app.points.models import Point

async def list_tree_types():
    async with async_session_maker() as session:
        result = await session.execute(select(TreeType))
        tree_types = result.scalars().all()
        if not tree_types:
            print("No tree types found.")
            return
        for t in tree_types:
            print(f"[{t.id}] {t.species} | Growth Target: {t.goal_growth_value} | Image: {t.image_src}")

async def add_tree_type(species: str, goal_growth_value: int, image_src: str):
    async with async_session_maker() as session:
        result = await session.execute(select(TreeType).where(TreeType.species == species))
        if result.scalar_one_or_none():
            print(f"⚠️ Tree type '{species}' already exists. Skipping.")
            return
        new_type = TreeType(
            species=species,
            goal_growth_value=goal_growth_value,
            image_src=image_src
        )
        session.add(new_type)
        await session.commit()
        print(f"Successfully added: {species}")

async def delete_tree_type(species: str):
    fallback_species = "Default Tree Type"
    async with async_session_maker() as session:
        result = await session.execute(select(TreeType).where(TreeType.species == species))
        tree_type_to_delete = result.scalar_one_or_none()
        if not tree_type_to_delete:
            print(f"Tree type '{species}' not found.")
            return

        result_fallback = await session.execute(
            select(TreeType).where(TreeType.species == fallback_species)
        )
        fallback = result_fallback.scalar_one_or_none()
        if not fallback:
            print(f"⚠️ Please add a fallback tree type named '{fallback_species}' first.")
            return
        if fallback.id == tree_type_to_delete.id:
            print(f"⚠️ The tree type to be deleted is the same as the fallback type. Operation aborted.")
            return

        from app.tree.models import Tree
        await session.execute(
            Tree.__table__.update()
            .where(Tree.type_id == tree_type_to_delete.id)
            .values(type_id=fallback.id)
        )

        await session.delete(tree_type_to_delete)
        await session.commit()
        print(f"Tree type '{species}' deleted. Associated trees moved to '{fallback_species}'.")


async def update_tree_type(species: str, goal_growth_value: int = None, image_src: str = None):
    async with async_session_maker() as session:
        result = await session.execute(select(TreeType).where(TreeType.species == species))
        tree_type = result.scalar_one_or_none()
        if not tree_type:
            print(f"Tree type '{species}' not found.")
            return
        if goal_growth_value:
            tree_type.goal_growth_value = goal_growth_value
        if image_src:
            tree_type.image_src = image_src
        await session.commit()
        print(f"🔄 Tree type '{species}' updated.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="🌳 Tree Type Management Tool")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # List tree types
    subparsers.add_parser("list", help="List all tree types")

    # Add new tree type
    add_parser = subparsers.add_parser("add", help="Add a new tree type")
    add_parser.add_argument("--species", required=True, help="Tree type name")
    add_parser.add_argument("--goal", required=True, type=int, help="Growth goal value")
    add_parser.add_argument("--image", required=True, help="Image path")

    # Delete tree type
    del_parser = subparsers.add_parser("delete", help="Delete a tree type")
    del_parser.add_argument("--species", required=True, help="Tree type name to delete")

    # Update tree type
    upd_parser = subparsers.add_parser("update", help="Update an existing tree type")
    upd_parser.add_argument("--species", required=True, help="Tree type name to update")
    upd_parser.add_argument("--goal", type=int, help="New growth goal value")
    upd_parser.add_argument("--image", help="New image path")

    args = parser.parse_args()

    async def main():
        if args.command == "list":
            await list_tree_types()
        elif args.command == "add":
            await add_tree_type(args.species, args.goal, args.image)
        elif args.command == "delete":
            await delete_tree_type(args.species)
        elif args.command == "update":
            await update_tree_type(args.species, args.goal, args.image)

    asyncio.run(main())
