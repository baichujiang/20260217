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
import { Dialog, DialogContent, DialogDescription, DialogTitle} from '@/components/ui/dialog'; // Make sure you have this component

interface ReviewImage {
  id: string;
  url: string;
  uploaded_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RestaurantCarousel() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [images, setImages] = useState<ReviewImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/reviews/restaurant/${id}/images`);

        if (!res.ok) throw new Error("Failed to fetch images");

        const data: ReviewImage[] = await res.json();

        setImages(
          data.length > 0
            ? data
            : [{ id: "fallback", url: "/default-restaurant.png", uploaded_at: "" }]
        );
      } catch {
        setImages([{ id: "fallback", url: "/default-restaurant.png", uploaded_at: "" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [id]);

  if (loading) return <div className="p-6">Loading images...</div>;

  return (
    <>
      <Carousel className="p-6 w-full">
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={img.id}>
              <div className="p-1">
                <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
                  <Image
                    src={img.url}
                    alt={`Uploaded image ${img.id}`}
                    fill
                    priority={index === 0}
                    onClick={() => setFullscreenImage(img.url)}
                    className="h-full w-full rounded-lg object-cover cursor-pointer hover:opacity-80 transition"
                  />
                </AspectRatio>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselDots />
      </Carousel>

      {/* Fullscreen Dialog */}
      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none">
          <DialogTitle />
          <DialogDescription />
          {fullscreenImage && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={fullscreenImage}
                alt="Full review image"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
