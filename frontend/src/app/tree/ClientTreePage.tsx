"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
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
import SearchParamHandler from "./SearchParamHandler";
import { Suspense } from "react";
import { useRouter } from "next/navigation"; 
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
  } from "@/components/ui/dialog";
  

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

interface User {
  avatar_url?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ClientTreePage() {
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [greenPoints, setGreenPoints] = useState<number>(0);
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedTreeId, setSelectedTreeId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const [badges, setBadges] = useState<any[]>([]);
  const kettleRef = useRef<HTMLImageElement | null>(null);
  const [user, setUser] = useState<User | null>(null);

  function triggerKettleAnimation() {
    if (!kettleRef.current) return;
  
    const kettle = kettleRef.current;
    kettle.classList.remove("animate-pour");
    void kettle.offsetWidth; 
    kettle.classList.add("animate-pour");
  
    setTimeout(() => {
      const stream = document.getElementById("water-stream") as HTMLElement | null;
      if (!stream) return;
  
      stream.classList.remove("hidden");  
      setTimeout(() => {
        stream.classList.add("hidden"); 
      }, 700); 
    }, 150); 
  }
  
  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/badges/my`)
      .then((res) => res.json())
      .then((data) => {
        setBadges(data); 
      })
      .catch((err) => {
        console.error("Failed to fetch badges", err);
      });
  }, []);

  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/trees/me`)
      .then(res => res.json())
      .then((data: TreeData[]) => setTrees(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchWithAuth(`${API_BASE_URL}/points/me/total`)
      .then(res => res.json())
      .then(data => setGreenPoints(data.total_points))
      .catch(console.error);
  }, []);

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
        `${API_BASE_URL}/trees/${treeId}/water`,
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
      const res = await fetchWithAuth(`${API_BASE_URL}/trees/`, {
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
        `${API_BASE_URL}/harvest/${selectedTreeId}`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Failed to harvest tree");
      const updated: TreeData = await res.json();
      setTrees(prev => prev.map(tree => (tree.id === updated.id ? updated : tree)));
      setShowRewardModal(false);
      setSelectedTreeId(null);
      setSuccessMessage("Harvest success! The gift will be delivered within a few days");

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
      <Suspense fallback={null}>
        <SearchParamHandler onCreate={handleCreateTree} />
      </Suspense>

      <Header />

      <section className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-green-200 -z-10" />
        <div className="absolute inset-x-0 top-0 h-full bg-[url('/background.png')] bg-cover bg-bottom -z-10" />
        <div className="p-4 pb-0 relative">
          <HeaderStats badges={badges.filter(b => b.unlocked && b.currentProgress >= b.requiredProgress).length} greenPoints={greenPoints} avatarUrl={user?.avatar_url || "/avatar-default.svg"} />

          <div className="absolute top-21 left-1 z-40 flex gap-4 px-4">
            <button
              onClick={() => router.push("/myrewards")}
              className="p-0 bg-transparent rounded-full animate-float transition active:scale-95 hover:scale-105"
              aria-label="My Rewards"
            >
              <Image
                src="/rewards.png"
                alt="My Rewards"
                width={80}
                height={80}
                className="drop-shadow-lg"
              />
            </button>
            </div>
        </div>
        {trees.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center mt-24 px-4 relative">
                {/* Gray sapling illustration */}
                <Image
                    src="/empty-tree.png"
                    alt="No trees"
                    width={150}
                    height={150}
                    className="mb-4 opacity-70 grayscale"
                />

                {/* Simple reminder text */}
                <p className="text-base text-gray-700 mb-10 font-medium leading-relaxed max-w-xs">
                Tap the <span className="text-green-700 font-bold">Greenpoints</span> button at the top right to start your green journey!
                </p>


                {/* Guide Arrow + Description */}
                <div className="absolute -top-20 right-2 flex flex-col items-center animate-bounce">
                    <Image src="/arrow-up.png" alt="Arrow" width={36} height={36} />
                    <p className="mt-1 px-2 py-1 text-xs font-semibold text-green-700 bg-yellow-100 rounded-md shadow">
                    Click here to plant a tree
                    </p>
                </div>
                </div>

        ) : (
            <div className="relative w-full mt-4">
              {currentTree && (
                <div className="absolute top-0 right-4 z-10">
                  <button
                    onClick={() => {
                        triggerKettleAnimation();
                        handleWater(currentTree.id, activeIndex);
                      }}
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
                  <div className="relative w-24 h-24">
                    <img
                      ref={kettleRef}
                      src="/kettle.png"
                      alt="Watering Kettle"
                      width={96}
                      height={96}
                      className="relative z-10 transition drop-shadow-lg" 
                    />

                  <img
                    id="water-stream"
                    src="/water-stream.png"
                    alt="Water Stream"
                    className="absolute left-[-36%] top-[40%] w-40 h-16 hidden"
                  />

                  </div>


                  </button>
                </div>
                
              )}
  
              <button onClick={goPrev} className="absolute top-1/2 left-2 z-10 p-2">❮</button>
              <div className="relative w-full -mt-4">
              <Carousel setApi={setEmblaApi} opts={{ loop: true }}>
                <CarouselContent className="p-4 pb-6">
                  {trees.map((tree, idx) => {
                    const { id, type, growth_value } = tree;
                    const max = type.goal_growth_value;
                    const src = type.image_src;
                    const percent = Math.min(100, Math.max(0, (growth_value / max) * 100));
                    return (
                      <CarouselItem
                        key={id}
                        className="relative flex flex-col items-center justify-end space-y-4 min-h-[400px]"
                      >
                      <div
                        className="relative w-64 h-64 cursor-pointer"
                        onClick={(e) => {
                          const img = e.currentTarget.querySelector("img");
                          if (img) {
                            img.classList.remove("animate-shake");
                            void img.offsetWidth;
                            img.classList.add("animate-shake");
                          }
                        const container = e.currentTarget;
                        const containerHeight = container.clientHeight;
                        for (let i = 0; i < 3; i++) {
                          const leaf = document.createElement("div");
                          leaf.className = "falling-leaf";
                          leaf.style.left = `${Math.random() * 90}%`;;
                          leaf.style.top = `${containerHeight * 0.1}px`;
                          leaf.style.animationDelay = `${i * 0.2}s`; 

                          e.currentTarget.appendChild(leaf);

                          setTimeout(() => {
                            leaf.remove();
                          }, 1600);
                        }

                        }}
                      >
                        <Image
                          src={src}
                          alt={type.species}
                          fill
                          className="object-cover object-center rounded-lg transition-all duration-300"
                          priority
                        />
                      </div>

                        <div className="relative w-full px-4">
                          {growth_value >= max && (
                            <div className="absolute -top-12 right-4 flex items-center gap-0 animate-bounce">
                              <Image src="/fruit.png" alt="Fruit" width={64} height={64} />
                              <button
                                onClick={() => openHarvestModal(id)}
                                className="text-md bg-yellow-400 rounded px-1 py-1 font-semibold text-white"
                              >
                                Harvest
                              </button>
                            </div>
                          )}
                          <div className="relative w-full -mt-0 mb-0">
                          <Progress
                            value={percent}
                            size="md"
                            indicatorClassName="bg-green-500"
                            className="bg-white shadow-md"
                          />
                          </div>
                          <p className="text-center mt-2 mb-2 text-lg font-semibold text-gray-900">
                            Growth: {growth_value} / {max}
                          </p>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="relative w-full mb-4">
                <CarouselDots />
                </div>
              </Carousel>
              </div>
  
              <button onClick={goNext} className="absolute top-1/2 right-2 z-10 p-2">❯</button>
            </div>
        )}
      </section>

      <div className="-mt-6 px-4" />
      <Leaderboard />

      <RewardModal
        open={showRewardModal}
        onClose={() => setShowRewardModal(false)}
        onSubmit={handleHarvestSubmit}
      />

        <Dialog
        open={!!successMessage}
        onOpenChange={(open) => {
            if (!open) setSuccessMessage(null);
        }}
        >
        <DialogContent className="max-w-sm">
            <DialogHeader>
            <DialogTitle className="text-green-700 text-lg">
                Harvest Success!
            </DialogTitle>
            </DialogHeader>
            <div className="text-gray-700 text-sm">
            The gift will be delivered within a few days.
            </div>
            <DialogFooter className="mt-4">
            <button
                onClick={() => {
                setSuccessMessage(null);
                router.push("/myrewards");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
                Go to My Rewards
            </button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

    </div>
  );
}
