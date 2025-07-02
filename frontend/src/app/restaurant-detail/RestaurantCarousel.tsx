'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '@/components/ui/carousel';

export default function RestaurantCarousel() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [imagesPath, setImagesPath] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchImages = async () => {
      try {
        // TODO
        // const res = await fetch(`http://localhost:8000/restaurants/${id}/images`);
        // if (!res.ok) throw new Error('Failed to fetch images');
        // const data: string[] = await res.json();
        const data = ["/mensa-1.jpg", "/mensa-2.jpg"]
        setImagesPath(data);
      } catch {
        setImagesPath(["/fallback-1.jpg", "/fallback-2.jpg"]); // fallback if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  if (loading) return <div className="p-6">Loading images...</div>;

  return (
    <Carousel className="p-6 w-full">
      <CarouselContent>
        {imagesPath.map((src, index) => (
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
  );
}
