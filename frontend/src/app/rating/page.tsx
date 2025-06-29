import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots
} from "@/components/ui/carousel";
import { Header } from "@/components/ui/Header";
import RatingPageContent from "./RatingPageContent";
import { Restaurant } from "@/types/restaurant"

// TODO: real pictures
const images = ["/mensa-1.jpg", "/mensa-2.jpg"];

async function fetchRestaurant(id: string): Promise<Restaurant | null> {
  try {
    const res = await fetch(`http://localhost:8000/restaurants/${id}`, {
      cache: "no-store"
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function RatingPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams?.id;
  if (!id) return notFound();

  const restaurant = await fetchRestaurant(id);
  if (!restaurant) return notFound();

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <Carousel className="p-6 w-full">
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src={src}
                    alt={`Image ${index + 1}`}
                    fill
                    className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                  />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>

      <Suspense fallback={<div className="p-6">Loading restaurant details...</div>}>
        <RatingPageContent {...restaurant}/>
      </Suspense>
    </main>
  );
}
