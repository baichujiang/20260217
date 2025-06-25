"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { Header } from "@/components/ui/Header";
import { HeaderStats } from "@/components/HeaderStats";
import { Leaderboard } from "@/components/Leaderboard";
import { Progress } from "@/components/ui/progress";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// 接口返回的树类型，来自 TreeTypeOut
interface TreeType {
  id: number;
  species: string;
  goal_growth_value: number;
  image_src: string;
}

// 用户树数据结构，包含 type 嵌套
interface TreeData {
  id: number;
  type: TreeType;
  growth_value: number;
  created_at: string;
}

export default function TreePage() {
  const userId = 1;
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [greenPoints, setGreenPoints] = useState<number>(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // TODO: error while building
  // const searchParams = useSearchParams();

  // 获取用户所有树
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🧪 token in localStorage:", token); // ✅ 临时调试用
  
    fetchWithAuth(`http://localhost:8000/trees/me`)
      .then(res => res.json())
      .then((data: TreeData[]) => {
        console.log("🐛 trees data fetched:", data); // 👈 添加这行
        setTrees(data);
      })
      .catch(console.error);
  }, []);
  

  // 获取用户积分
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetchWithAuth(`http://localhost:8000/points/me/total`)
      .then(res => res.json())
      .then(data => setGreenPoints(data.total_points))
      .catch(console.error);
  }, []);

  // 若有 new 参数，自动创建
  // useEffect(() => {
  //   const typeId = searchParams.get("new");
  //   if (typeId) handleCreateTree(Number(typeId));
  // }, [searchParams]);

  // 浇水
  async function handleWater(treeId: number, idx: number) {
    try {
      const res = await fetchWithAuth(`http://localhost:8000/trees/${treeId}/water`, {
        method: "POST",
        body: JSON.stringify({ amount: 10 }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updated: TreeData = await res.json();
      setTrees(prev => prev.map((t, i) => i === idx ? updated : t));
      setGreenPoints(prev => prev - 10);
    } catch (e) {
      console.error(e);
    }
  }
  

  // 创建新树
  async function handleCreateTree(type_id: number) {
    try {
      const token = localStorage.getItem("token");
      const res = await fetchWithAuth("http://localhost:8000/trees/", {
        method: "POST",
        body: JSON.stringify({ type_id }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const t: TreeData = await res.json();
      setTrees(prev => [...prev, t]);
    } catch (e) {
      console.error(e);
    }
  }
  

  // Carousel 监听
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  function goPrev() { emblaApi?.scrollPrev(); }
  function goNext() { emblaApi?.scrollNext(); }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-green-200 -z-10" />
        <div className="absolute inset-x-0 top-0 h-full bg-[url('/background.png')] bg-cover bg-bottom -z-10" />
        <div className="p-4 pb-0">
          <HeaderStats badges={10} greenPoints={greenPoints} avatarUrl = "/avatar-default.svg"/>
          <div className="relative w-full mt-4">
            <button onClick={goPrev} className="absolute top-1/2 left-2 z-10 p-2">❮</button>
            <Carousel setApi={setEmblaApi} opts={{ loop: true }}>
              <CarouselContent className="p-4 pb-6">
                {trees.map((tree, idx) => {
                  const { id, type, growth_value } = tree;
                  const max = type.goal_growth_value;
                  const src = type.image_src;
                  const percent = Math.min(100, Math.max(0, (growth_value / max) * 100));
                  return (
                    <CarouselItem key={id} className="relative flex flex-col items-center justify-end space-y-4 min-h-[400px]">
                      <Button variant="ghost" size="lg" onClick={() => handleWater(id, idx)} disabled={growth_value >= max || greenPoints < 10} title="Water Plant">
                        <Image src="/kettle.png" alt="Watering Kettle" width={96} height={96} />
                      </Button>
                      <div className="relative w-64 h-64">
                        <Image src={src} alt={`${type.species} Tree`} fill className="object-cover object-bottom rounded-lg" />
                      </div>
                      <div className="relative w-full px-4">
                        {growth_value >= max && (
                          <div className="absolute -top-6 right-4 flex items-center gap-2 animate-bounce">
                            <Image src="/fruit.png" alt="Fruit" width={32} height={32} />
                            <button onClick={() => handleCreateTree(type.id)} className="text-xs bg-yellow-300 rounded px-2 py-1 font-semibold text-white">Harvest</button>
                          </div>
                        )}
                        <Progress value={percent} size="md" indicatorClassName="bg-green-500" className="bg-white shadow-md" />
                        <p className="text-center mt-2 text-lg font-semibold text-gray-900">Growth: {growth_value} / {max}</p>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
            <button onClick={goNext} className="absolute top-1/2 right-2 z-10 p-2">❯</button>
          </div>
        </div>
      </section>
      <div className="-mt-6 px-4" />
      <Leaderboard />
    </div>
  );
}
