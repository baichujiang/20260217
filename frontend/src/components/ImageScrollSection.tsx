"use client"

import { useEffect, useState } from "react"
import { RestaurantCardProps } from "@/types/restaurant"
import RestaurantCard from "@/components/RestaurantCard"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function ImageScrollSection() {
  const [restaurants, setRestaurants] = useState<RestaurantCardProps[]>([])

  useEffect(() => {
    const fetchRestaurantsWithImages = async () => {
      try {
        const res = await fetch("http://localhost:8000/restaurants/top-sustainable/")
        if (!res.ok) throw new Error("Failed to fetch restaurants")
        const data = await res.json()

        const enriched = await Promise.all(
          data.map(async (restaurant: any) => {
            try {
              const imgRes = await fetch(
                `http://localhost:8000/reviews/restaurant/${restaurant.id}/images?limit=1`
              )
              const imgData = await imgRes.json()
              const image = imgData.length > 0 ? imgData[0].url : "/default-restaurant.png"

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
                image: "/default-restaurant.png",
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
