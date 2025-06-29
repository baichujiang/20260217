import { Suspense } from "react";
import { Header } from "@/components/ui/Header";
import RestaurantCarousel from "./RestaurantCarousel";
import RatingPageContent from "./RatingPageContent";

export default function RatingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <Suspense fallback={<div className="p-6">Loading restaurant details...</div>}>
        <RestaurantCarousel />
        <RatingPageContent />
      </Suspense>
    </main>
  );
}
