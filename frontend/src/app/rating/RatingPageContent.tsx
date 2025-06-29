'use client'

import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import OverviewReviewTab from '@/components/OverviewReviewTab';
import { Restaurant } from "@/types/restaurant"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function RatingPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`http://localhost:8000/restaurants/${id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Restaurant = await res.json();
        setRestaurant(data);
      } catch (err: any) {
        setError(err.message || "Failed to load restaurant.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !restaurant) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <>
      <h3 className="px-6 scroll-m-20 text-2xl font-semibold tracking-tight">
        {restaurant.name}
      </h3>

      <div className="px-6 py-2 gap-2 flex flex-row">
        <Badge variant="outline" className="text-base">
          <Star fill="currentColor" />
          {restaurant.normal_score}
        </Badge>
        <Badge variant="outline" className="text-green-500 text-base">
          <Star fill="currentColor" />
          {typeof restaurant.sustainability_score === "number"
            ? restaurant.sustainability_score.toFixed(1)
            : "N/A"}
        </Badge>
      </div>

      <OverviewReviewTab {...restaurant} />
    </>
  );
}
