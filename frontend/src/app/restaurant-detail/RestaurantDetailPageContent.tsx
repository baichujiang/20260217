'use client'

import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import OverviewReviewTab from '@/components/OverviewReviewTab';
import { Restaurant } from "@/types/restaurant"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Comment } from "@/types/review"
import { TopTag } from '@/types/restaurant';


export default function RestaurantDetailPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tags, setTags] = useState<TopTag[]>([]);

useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [restaurantRes, commentsRes, tagsRes] = await Promise.all([
          fetch(`http://localhost:8000/restaurants/${id}`),
          fetch(`http://localhost:8000/reviews/restaurant/${id}/comments`),
          fetch(`http://localhost:8000/restaurants/${id}/top-tags`)
        ]);

        if (!restaurantRes.ok || !commentsRes.ok || !tagsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const restaurantData: Restaurant = await restaurantRes.json();
        const commentsData: Comment[] = await commentsRes.json();
        const tagsData: TopTag[] = await tagsRes.json();

        setRestaurant(restaurantData);
        setComments(commentsData);
        setTags(tagsData);
      } catch (err: any) {
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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

      <OverviewReviewTab restaurant={restaurant} comments={comments} tags={tags}/>
    </>
  );
}
