'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import OverviewReviewTab from '@/components/OverviewReviewTab';
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'

interface Restaurant {
  id: string;
  name: string;
  address: string;
  website: string;
  score: number;
  susScore: number;
}

export default function RatingPageContent() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) return;

    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`http://localhost:4000/restaurants/${id}`);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data: Restaurant = await res.json();
        setRestaurant(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch restaurant');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;
  if (!restaurant || !id) return null;

  return (
    <>
        <h3 className="px-6 scroll-m-20 text-2xl font-semibold tracking-tight">
        {restaurant.name}
        </h3>

        <div className='px-6 py-2 gap-2 flex flex-row'>
            <Badge
                variant="outline"
                className="text-base"
            >
                <Star fill="currentColor" />
                {restaurant.score}
            </Badge>
            <Badge
                variant="outline"
                className="text-green-500 text-base"
            >
                <Star fill="currentColor" />
                {restaurant.susScore}
            </Badge>
        </div>

        <OverviewReviewTab restaurantId={id} />
    </>
  );
}
