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
            print("无任何树种数据。")
            return
        for t in tree_types:
            print(f"[{t.id}] {t.species} | 成长目标: {t.goal_growth_value} | 图片: {t.image_src}")

async def add_tree_type(species: str, goal_growth_value: int, image_src: str):
    async with async_session_maker() as session:
        result = await session.execute(select(TreeType).where(TreeType.species == species))
        if result.scalar_one_or_none():
            print(f"⚠️ 树种 '{species}' 已存在，跳过。")
            return
        new_type = TreeType(
            species=species,
            goal_growth_value=goal_growth_value,
            image_src=image_src
        )
        session.add(new_type)
        await session.commit()
        print(f"✅ 添加成功：{species}")

async def delete_tree_type(species: str):
    fallback_species = "默认树种"  # ⚠️ 你可以自定义这个备用树种名称
    async with async_session_maker() as session:
        # 查找将要删除的树种
        result = await session.execute(select(TreeType).where(TreeType.species == species))
        tree_type_to_delete = result.scalar_one_or_none()
        if not tree_type_to_delete:
            print(f"❌ 未找到名为 '{species}' 的树种。")
            return

        # 查找备用树种（不能是同一个）
        result_fallback = await session.execute(
            select(TreeType).where(TreeType.species == fallback_species)
        )
        fallback = result_fallback.scalar_one_or_none()
        if not fallback:
            print(f"⚠️ 请先添加一个名为 '{fallback_species}' 的备用树种。")
            return
        if fallback.id == tree_type_to_delete.id:
            print(f"⚠️ 要删除的树种和备用树种是同一个，操作中止。")
            return

        # 更新所有引用该类型的树
        from app.tree.models import Tree
        await session.execute(
            Tree.__table__.update()
            .where(Tree.type_id == tree_type_to_delete.id)
            .values(type_id=fallback.id)
        )

        # 删除该树种
        await session.delete(tree_type_to_delete)
        await session.commit()
        print(f"✅ 树种 '{species}' 已删除，关联树已迁移到 '{fallback_species}'。")


async def update_tree_type(species: str, goal_growth_value: int = None, image_src: str = None):
    async with async_session_maker() as session:
        result = await session.execute(select(TreeType).where(TreeType.species == species))
        tree_type = result.scalar_one_or_none()
        if not tree_type:
            print(f"❌ 未找到名为 '{species}' 的树种。")
            return
        if goal_growth_value:
            tree_type.goal_growth_value = goal_growth_value
        if image_src:
            tree_type.image_src = image_src
        await session.commit()
        print(f"🔄 树种 '{species}' 已更新。")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="🌳 树种管理工具")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # 列出树种
    subparsers.add_parser("list", help="列出所有树种")

    # 添加
    add_parser = subparsers.add_parser("add", help="添加新的树种")
    add_parser.add_argument("--species", required=True, help="树种名")
    add_parser.add_argument("--goal", required=True, type=int, help="成长目标值")
    add_parser.add_argument("--image", required=True, help="图片路径")

    # 删除
    del_parser = subparsers.add_parser("delete", help="删除树种")
    del_parser.add_argument("--species", required=True, help="要删除的树种名")

    # 修改
    upd_parser = subparsers.add_parser("update", help="修改已有树种")
    upd_parser.add_argument("--species", required=True, help="要修改的树种名")
    upd_parser.add_argument("--goal", type=int, help="新的成长目标值")
    upd_parser.add_argument("--image", help="新的图片路径")

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
