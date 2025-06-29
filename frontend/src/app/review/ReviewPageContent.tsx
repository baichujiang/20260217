'use client'

import { useSearchParams } from "next/navigation";
import ReviewForm from "@/components/ReviewForm";
import { Header } from "@/components/ui/Header";

export default function ReviewPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) return <p className="p-6 text-red-500">Missing restaurant ID.</p>;

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="p-6">
        <ReviewForm restaurantId={id} />
      </div>
    </main>
  );
}
