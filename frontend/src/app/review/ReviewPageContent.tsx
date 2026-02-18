'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReviewForm from '@/app/review/ReviewForm';
import { Header } from '@/components/Header';
import { ReviewFormProps, Tag } from '@/types/review';

import { getApiBaseUrl } from "@/lib/apiBaseUrl";

export default function ReviewPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [restaurantName, setRestaurantName] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [restaurantRes, tagsRes] = await Promise.all([
          fetch(`${getApiBaseUrl()}/restaurants/${id}`),
          fetch(`${getApiBaseUrl()}/reviews/tags`)
        ]);

        const restaurantData = await restaurantRes.json();
        const tagsData = await tagsRes.json();

        setRestaurantName(restaurantData.name);
        setTags(tagsData);
      } catch (err) {
        console.error("Failed to fetch restaurant or tags", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  if (!id) return <p className="p-6 text-red-500">Missing restaurant ID.</p>;
  if (loading) return <p className="p-6 text-gray-500">Loading...</p>;

  const prop: ReviewFormProps = {
    restaurant_id: Number(id),
    restaurant_name: restaurantName,
    tags,
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="p-6">
        <ReviewForm {...prop} />
      </div>
    </main>
  );
}
