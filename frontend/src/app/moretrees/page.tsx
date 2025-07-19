"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

interface TreeOption {
  id: number;
  species: string;
  goal_growth_value: number;
  image_src: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MoreTreesPage() {
  const router = useRouter();
  const [options, setOptions] = useState<TreeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTreeTypes = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE_URL}/trees/types`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setOptions(
          Array.isArray(data)
          ? data.filter((t: TreeOption) => t.species !== "默认树种")
          : []
        );
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load tree types");
      } finally {
        setLoading(false);
      }
    };

    fetchTreeTypes();
  }, []);

  const handleCreateTree = async (type_id: number) => {
    setCreating(true);
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/trees/`, {
        method: "POST",
        body: JSON.stringify({ type_id }),
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      await res.json();
      router.replace("/tree");
    } catch (err) {
      console.error(err);
      alert("Failed to create tree");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f0fdf4_35%,_white_40%)]">
      <Header />
      <div className="p-6 pt-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Choose a Tree to Grow
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading trees...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {options.map((t) => (
              <Card
                key={t.id}
                className={`p-4 rounded-xl cursor-pointer shadow-md transition duration-150 ${
                  selectedId === t.id
                    ? "border-2 border-green-600 bg-green-50"
                    : "border border-gray-200 bg-white/80 hover:ring-2 hover:ring-green-300"
                }`}
                onClick={() => {
                  setSelectedId(t.id);
                  handleCreateTree(t.id);
                }}
              >

                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={t.image_src || "/fallback.png"}
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
        )}

        {creating && (
          <p className="mt-4 text-center text-sm text-gray-600">
            Creating tree...
          </p>
        )}
      </div>
    </div>
  );
}
