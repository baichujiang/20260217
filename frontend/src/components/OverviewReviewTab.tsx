'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs_underline"
import CommentCards from "./CommentCards"
import RestaurantOverview from "./RestaurantOverview"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCallback } from "react";
import { Restaurant } from "@/types/restaurant"
import { Comment } from "@/types/review"
import { TopTag } from "@/types/restaurant";

interface Props {
  restaurant: Restaurant;
  comments: Comment[];
  tags: TopTag[]
}

export default function OverviewReviewTab({ restaurant, comments, tags }: Props) {
  const router = useRouter();

  const handleWriteReviewClick = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please log in to write a review.");
      return;
    }

    router.push(`/review?id=${restaurant.id}`);
  }, [restaurant.id, router]);

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
        <CommentCards comments={comments} tags={tags} />
        <div className="space-y-6 pb-10"></div>

        <div className="fixed bottom-0 left-0 w-full p-4 sm:static sm:border-none sm:p-0">
          <div className="max-w-md mx-auto">
            <Button
              onClick={handleWriteReviewClick}
              className="w-full bg-[#57cc99] text-white hover:bg-[#49ac81ff]"
            >
              Write a Review
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
