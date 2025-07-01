'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs_underline"
import CommentCards from "./CommentCards"
import RestaurantOverview from "./RestaurantOverview"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Restaurant } from "@/types/restaurant"
import { Comment } from "@/types/review"

interface Props {
  restaurant: Restaurant;
  comments: Comment[];
}

export default function OverviewReviewTab({ restaurant, comments }: Props) {
  return (
    <Tabs defaultValue="Overview">
      <TabsList>
        <TabsTrigger value="Overview">Overview</TabsTrigger>
        <TabsTrigger value="Review">Review</TabsTrigger>
      </TabsList>
      <TabsContent value="Overview" className="px-6 py-2 space-y-6">
        <RestaurantOverview {...restaurant} />
      </TabsContent>
      <TabsContent value="Review">
        <CommentCards comments={comments}/>
        <div className="space-y-6 pb-10"></div>
            <div className="fixed bottom-0 left-0 w-full p-4 sm:static sm:border-none sm:p-0">
                <div className="max-w-md mx-auto">
                <Link href={`/review?id=${restaurant.id}`} key={restaurant.id}>
                    <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                    Write a Review
                    </Button>
                </Link>
                </div>
            </div>
      </TabsContent>
    </Tabs>
  )
}
