"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { Card } from "@/components/ui/card";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// 后端提供的树种配置接口返回结构
interface TreeOption {
  id: number;
  species: string;
  goal_growth_value: number;
  image_src: string;
}

export default function MoreTreesPage() {
  const router = useRouter();
  const [options, setOptions] = useState<TreeOption[]>([]);
  const [creating, setCreating] = useState(false);

  // 从后端获取可选树种列表，兼容直接数组或对象包裹
  useEffect(() => {
    fetchWithAuth("http://localhost:8000/trees/types")
      .then((res) => res.json())
      .then((raw) => {
        const list: TreeOption[] = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as any).types)
          ? (raw as any).types
          : [];
        setOptions(list);
      })
      .catch(console.error);
  }, []);

  // 创建用户树，仅传 type_id，使用 token 身份识别
  async function handleCreateTree(type_id: number) {
    setCreating(true);
    try {
    
      const res = await fetchWithAuth("http://localhost:8000/trees/", {
        method: "POST",
        body: JSON.stringify({ type_id }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await res.json();
      router.push("/tree");
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-white">
      <Header />
      <div className="p-6 pt-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Choose a Tree to Grow
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {options.map((t) => (
            <Card
              key={t.id}
              className="p-4 bg-white/80 rounded-lg cursor-pointer hover:ring-2 hover:ring-green-500 transition"
              onClick={() => handleCreateTree(t.id)}
            >
              <div className="relative w-full h-40 mb-4">
              <Image
                src={t.image_src || "/fallback.png"}  // fallback 是默认图（需放在 public 文件夹中）
                alt={t.species || "Tree"}
                fill
                className="object-cover rounded-lg"
                />
              </div>
              <h3 className="text-lg font-semibold mb-1 text-center">
                {t.species.charAt(0).toUpperCase() + t.species.slice(1)} Tree
              </h3>
              <p className="text-sm text-gray-600 text-center">
                {t.goal_growth_value} pts to mature
              </p>
            </Card>
          ))}
        </div>
        {creating && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Creating tree...
          </p>
        )}
      </div>
    </div>
  );
}
