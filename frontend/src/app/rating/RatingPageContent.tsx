'use client'

import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import OverviewReviewTab from '@/components/OverviewReviewTab';
import { Restaurant } from "@/types/restaurant"


export default function RatingPageContent(restaurant: Restaurant) {
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
