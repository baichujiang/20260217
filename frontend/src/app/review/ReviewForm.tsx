'use client'

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import clsx from "clsx"
import { toast } from "sonner"
import { Review, ReviewFormProps, Tag } from "@/types/review"

const categories = ["General", "Food", "Service", "Environment", "Sourcing", "Waste", "Menu", "Energy"]


export default function ReviewForm({ 
    restaurant_id,
    restaurant_name,
    tags
}: ReviewFormProps) {
    const [ratings, setRatings] = useState<Record<string, number>>({});
    const [experience, setExperience] = useState("");
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleRating = (category: string, value: number) => {
        setRatings((prev) => ({ ...prev, [category]: value }));
    };

    const toggleTag = (tagId: number) => {
        setSelectedTags((prev) =>
            prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
        );
    };

    const handleSubmit = async () => {
        // Check that all required ratings are filled and not 0
        for (const category of categories) {
            if (!ratings[category] || ratings[category] < 1) {
                toast(`Please provide a rating for ${category}`);
                return;
            }
        }

        setIsSubmitting(true);

        const payload: Review = {
            normal_rating: ratings["General"] || 0,
            food_rating: ratings["Food"] || 0,
            service_rating: ratings["Service"] || 0,
            environment_rating: ratings["Environment"] || 0,
            sustainablility_rating: ratings["Sustainability"] || 0,
            sourcing_rating: ratings["Sourcing"] || 0,
            waste_rating: ratings["Waste"] || 0,
            menu_rating: ratings["Menu"] || 0,
            energy_rating: ratings["Energy"] || 0,
            comment: experience,
            tag_ids: selectedTags,
            restaurant_id,
        };

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:8000/reviews/", {
                method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                  },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to submit review");

            toast("Review submitted successfully!");
            setRatings({});
            setExperience("");
            setSelectedTags([]);
        } catch (error) {
            toast("Failed to submit review");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const tagGroups = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
        acc[tag.category] = acc[tag.category] || [];
        acc[tag.category].push(tag);
        return acc;
    }, {});


    return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{restaurant_name || "Loading..."}</h2>

      {/* Ratings */}
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category} className="flex items-center gap-4">
            <span className="w-24 text-sm">{category}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={20}
                  className={clsx(
                    "cursor-pointer",
                    i <= (ratings[category] || 0)
                      ? "fill-black text-black"
                      : "text-gray-400"
                  )}
                  onClick={() => handleRating(category, i)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Experience Textarea */}
      <Textarea
        placeholder="Share your experience"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        className="min-h-[100px]"
      />

      {/* Tag Groups */}
      {Object.entries(tagGroups).map(([category, groupTags]) => (
        <div key={category} className="space-y-2">
          <h3 className="font-semibold text-sm">{category}</h3>
          <div className="flex flex-wrap gap-2">
            {groupTags.map((tag) => (
              <Button
                key={tag.id}
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                className="rounded-full text-sm"
                onClick={() => toggleTag(tag.id)}
                type="button"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 sm:static sm:border-none sm:p-0">
        <div className="max-w-md mx-auto">
          <Button
            className="w-full bg-green-600 text-white hover:bg-green-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </div>
    </div>
  );
}
