"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface Badge {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  category: string;
  unlocked: boolean;
  currentProgress: number;
  requiredProgress: number;
  lastUnlocked?: number;
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:8000/badges/my");
        const data = await res.json();
        setBadges(data);
      } catch (err) {
        console.error("Failed to fetch badges", err);
      }
    };

    fetchBadges();
  }, []);

  const categories = Array.from(new Set(badges.map((b) => b.category)));

  const toggleCategory = (category: string) => {
    setOpenMap((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const totalBadges = badges.length;
  const totalUnlocked = badges.filter(
    (b) => b.unlocked && b.currentProgress >= b.requiredProgress
  ).length;

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f0fdf4_35%,_white_40%)]">
      <Header />
      <div className="p-6 pt-4">
        <h1 className="text-3xl font-bold text-center mb-4">Badge Achievements</h1>
        <p className="text-center text-sm text-gray-600 mb-6">
          Total unlocked: {totalUnlocked} / {totalBadges}
        </p>

        {categories.map((category) => {
          const isOpen = openMap[category] || false;
          const categoryBadges = badges
            .filter((b) => b.category === category)
            .sort((a, b) => {
              const progressA = a.unlocked ? 999 : a.currentProgress / a.requiredProgress;
              const progressB = b.unlocked ? 999 : b.currentProgress / b.requiredProgress;
              if (progressB !== progressA) return progressB - progressA;
              return (b.lastUnlocked || 0) - (a.lastUnlocked || 0);
            });

          const unlockedCount = categoryBadges.filter(
            (b) => b.unlocked && b.currentProgress >= b.requiredProgress
          ).length;

          return (
            <div key={category} className="mb-6 bg-white/80 rounded-lg">
              <div
                className="flex justify-between items-center cursor-pointer px-4 py-3 border-b"
                onClick={() => toggleCategory(category)}
              >
                <div>
                  <h2 className="text-xl font-semibold">{category}</h2>
                  <p className="text-sm text-gray-500">
                    Unlocked: {unlockedCount} / {categoryBadges.length}
                  </p>
                </div>
                <span className="text-xl">{isOpen ? "▲" : "▼"}</span>
              </div>

              {isOpen && (
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {categoryBadges.map((badge) => {
                    const progressRatio = badge.currentProgress / badge.requiredProgress;
                    const isProgressFull = progressRatio >= 1;

                    return (
                      <div
                        key={badge.id}
                        className="border p-3 rounded-lg bg-white shadow-md flex flex-col items-center"
                      >
                        <img
                          src={badge.icon || "/default-badge.png"}
                          alt={badge.name}
                          className={`w-16 h-16 mb-2 rounded-full object-cover transition ${
                            !badge.unlocked || !isProgressFull
                              ? "filter grayscale brightness-75"
                              : ""
                          }`}
                        />
                        <p className="text-center font-medium text-sm">{badge.name}</p>
                        <div className="text-center text-xs text-gray-500">
                          {badge.unlocked && isProgressFull
                            ? "Unlocked"
                            : badge.currentProgress > 0
                            ? `${badge.currentProgress} / ${badge.requiredProgress}`
                            : "Locked 🔒"}
                        </div>

                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              badge.unlocked && isProgressFull
                                ? "bg-yellow-400"
                                : "bg-gray-300"
                            }`}
                            style={{
                              width: `${Math.min(100, progressRatio * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
