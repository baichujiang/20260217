import OverviewReviewTab from '@/components/OverviewReviewTab'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import TopActionBar from '@/components/TopActionBar'

const images = [
  "/mensa-1.jpg",
  "/mensa-2.jpg"
]

interface Restaurant {
    id: string,
    name: string,
    address: string,
    website: string,
    score: number,
    susScore: number
}

async function getRestaurantById(id: string): Promise<Restaurant> {
    const result = await fetch(`http://localhost:4000/restaurants/${id}`)
    return result.json()
}

export default async function Home() {
  const restaurant = await getRestaurantById("1")

  return (
    <main>
      <TopActionBar />
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
      <h3 className="px-6 scroll-m-20 text-2xl font-semibold tracking-tight">
        {restaurant.name}
      </h3>
      <div className='px-6 py-2 gap-2 flex flex-row'>
        <Badge
          variant="outline"
          className="text-base"
        >
          <Star fill="currentColor" />
          {restaurant.score}
        </Badge>
        <Badge
          variant="outline"
          className="text-green-500 text-base"
        >
          <Star fill="currentColor" />
          {restaurant.susScore}
        </Badge>
      </div>
      <OverviewReviewTab></OverviewReviewTab>
    </main>
  )
}