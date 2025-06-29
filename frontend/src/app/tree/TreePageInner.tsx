"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
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
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import RewardModal, { AddressFormData } from "@/components/RewardModal";

interface TreeType {
  id: number;
  species: string;
  goal_growth_value: number;
  image_src: string;
}

interface TreeData {
  id: number;
  type: TreeType;
  growth_value: number;
  created_at: string;
}

export default function TreePageInner() {
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [greenPoints, setGreenPoints] = useState<number>(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedTreeId, setSelectedTreeId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchWithAuth(`http://localhost:8000/trees/me`)
      .then(res => res.json())
      .then((data: TreeData[]) => setTrees(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchWithAuth(`http://localhost:8000/points/me/total`)
      .then(res => res.json())
      .then(data => setGreenPoints(data.total_points))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const typeId = searchParams.get("new");
    if (typeId) handleCreateTree(Number(typeId));
  }, [searchParams]);

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

  const currentTree = trees[activeIndex];
  const canWater =
    currentTree &&
    currentTree.growth_value < currentTree.type.goal_growth_value &&
    greenPoints >= 10;

  async function handleWater(treeId: number, idx: number) {
    try {
      const res = await fetchWithAuth(
        `http://localhost:8000/trees/${treeId}/water`,
        {
          method: "POST",
          body: JSON.stringify({ amount: 10 }),
        }
      );
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const updated: TreeData = await res.json();
      setTrees(prev => prev.map((t, i) => (i === idx ? updated : t)));
      setGreenPoints(prev => prev - 10);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleCreateTree(type_id: number) {
    try {
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

  function openHarvestModal(treeId: number) {
    setSelectedTreeId(treeId);
    setShowRewardModal(true);
  }

  async function handleHarvestSubmit(data: AddressFormData) {
    if (selectedTreeId === null) return;
    try {
      const res = await fetchWithAuth(
        `http://localhost:8000/trees/${selectedTreeId}/harvest`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to harvest tree");
      const updated: TreeData = await res.json();
      setTrees(prev =>
        prev.map(tree => (tree.id === updated.id ? updated : tree))
      );
      setShowRewardModal(false);
      setSelectedTreeId(null);
    } catch (e) {
      console.error(e);
      alert("Failed to submit reward address");
    }
  }

  function goPrev() {
    emblaApi?.scrollPrev();
  }

  function goNext() {
    emblaApi?.scrollNext();
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      <section className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-green-200 -z-10" />
        <div className="absolute inset-x-0 top-0 h-full bg-[url('/background.png')] bg-cover bg-bottom -z-10" />
        <div className="p-4 pb-0">
          <HeaderStats badges={10} greenPoints={greenPoints} avatarUrl = "/avatar-default.svg" />

          <div className="relative w-full mt-4">
            {currentTree && (
              <div className="absolute top-0 right-4 z-10">
                <button
                  onClick={() => handleWater(currentTree.id, activeIndex)}
                  disabled={!canWater}
                  className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium ${
                    canWater
                      ? "bg-transparent text-white"
                      : "grayscale opacity-50 text-gray-500 cursor-not-allowed"
                  }`}
                  title={
                    greenPoints < 10
                      ? `Not enough points (${greenPoints})`
                      : `Water this tree`
                  }
                >
                  <Image
                    src="/kettle.png"
                    alt="Watering Kettle"
                    width={96}
                    height={96}
                  />
                </button>
              </div>
            )}

            <button
              onClick={goPrev}
              className="absolute top-1/2 left-2 z-10 p-2"
            >
              ❮
            </button>

            <Carousel setApi={setEmblaApi} opts={{ loop: true }}>
              <CarouselContent className="p-4 pb-6">
                {trees.map((tree, idx) => {
                  const { id, type, growth_value } = tree;
                  const max = type.goal_growth_value;
                  const src = type.image_src;
                  const percent = Math.min(
                    100,
                    Math.max(0, (growth_value / max) * 100)
                  );
                  return (
                    <CarouselItem
                      key={id}
                      className="relative flex flex-col items-center justify-end space-y-4 min-h-[400px]"
                    >
                      <div className="relative w-64 h-64">
                        <Image
                          src={src}
                          alt={`${type.species}`}
                          fill
                          className="object-cover object-bottom rounded-lg"
                          priority
                        />
                      </div>
                      <div className="relative w-full px-4">
                        {growth_value >= max && (
                          <div className="absolute -top-12 right-0 flex items-center gap-2 animate-bounce">
                            <Image
                              src="/fruit.png"
                              alt="Fruit"
                              width={64}
                              height={64}
                            />
                            <button
                              onClick={() => openHarvestModal(id)}
                              className="text-md bg-yellow-300 rounded px-2 py-1 font-semibold text-white"
                            >
                              Harvest
                            </button>
                          </div>
                        )}
                        <Progress
                          value={percent}
                          size="md"
                          indicatorClassName="bg-green-500"
                          className="bg-white shadow-md"
                        />
                        <p className="text-center mt-2 text-lg font-semibold text-gray-900">
                          Growth: {growth_value} / {max}
                        </p>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselDots />
            </Carousel>

            <button
              onClick={goNext}
              className="absolute top-1/2 right-2 z-10 p-2"
            >
              ❯
            </button>
          </div>
        </div>
      </section>

      <div className="-mt-6 px-4" />
      <Leaderboard />

      <RewardModal
        open={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onSubmit={handleHarvestSubmit}
      />
    </div>
  );
}
