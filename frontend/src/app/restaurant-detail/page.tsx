import { Suspense } from "react";
import { Header } from "@/components/ui/Header";
import RestaurantCarousel from "./RestaurantCarousel";
import RestaurantDetailPageContent from "./RestaurantDetailPageContent";

export default function RestaurantDetailPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      <Suspense fallback={<div className="p-6">Loading restaurant details...</div>}>
        <RestaurantCarousel />
        <RestaurantDetailPageContent />
      </Suspense>
    </main>
  );
}
