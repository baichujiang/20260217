"use client"

import { useEffect, useState } from "react"
import { RestaurantCardProps } from "@/types/restaurant"
import RestaurantCard from "@/components/RestaurantCard"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { getApiBaseUrl } from "@/lib/apiBaseUrl";

// 首页无评论图时用的示例图（public/restaurants/R1.jpeg ~ R10.jpeg）
const PLACEHOLDER_IMAGES = Array.from({ length: 10 }, (_, i) => `/restaurants/R${i + 1}.jpeg`)

export default function ImageScrollSection() {
  const [restaurants, setRestaurants] = useState<RestaurantCardProps[]>([])

  useEffect(() => {
    const fetchRestaurantsWithImages = async () => {
      const api = getApiBaseUrl()
      if (!api) return
      try {
        const res = await fetch(`${api}/restaurants/top-sustainable?limit=6`)
        if (!res.ok) throw new Error(`Failed to fetch restaurants: ${res.status}`)
        const data = await res.json()

        const enriched = await Promise.all(
          data.map(async (restaurant: any, index: number) => {
            const placeholder = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]
            try {
              const imgRes = await fetch(
                `${api}/reviews/restaurant/${restaurant.id}/images?limit=1`
              )
              const imgData = await imgRes.json()
              const image = imgData.length > 0 ? imgData[0].url : placeholder

              return {
                id: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                normal_score: restaurant.normal_score,
                sustainability_score: restaurant.sustainability_score,
                image,
              } satisfies RestaurantCardProps
            } catch {
              return {
                id: restaurant.id,
                name: restaurant.name,
                address: restaurant.address,
                normal_score: restaurant.normal_score,
                sustainability_score: restaurant.sustainability_score,
                image: placeholder,
              } satisfies RestaurantCardProps
            }
          })
        )

        setRestaurants(enriched)
      } catch (err) {
        console.error("Error loading top restaurants:", err)
      }
    }

    fetchRestaurantsWithImages()
  }, [])

  if (restaurants.length === 0) return null

return (
  <Carousel
    opts={{ align: "start" }}
    className="w-full max-w-6xl mx-auto"
  >
    <CarouselContent>
      {restaurants.map((restaurant) => (
        <CarouselItem
          key={restaurant.id}
          className="basis-1/2"
        >
          <div className="p-1">
            <RestaurantCard {...restaurant} variant="small" />
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 z-10 visible" />
    <CarouselNext className="right-2 top-1/2 -translate-y-1/2 z-10 visible" />
  </Carousel>
)

}
