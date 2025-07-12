"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/ui/Header"
import RestaurantCard from "@/components/RestaurantCard"
import { RestaurantCardProps } from "@/types/restaurant"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RestaurantPage() {
  const [restaurants, setRestaurants] = useState<RestaurantCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/restaurants/top-sustainable?limit=10`)
        if (!res.ok) throw new Error("Failed to fetch restaurants")

        const data = await res.json()

        const restaurantsWithImages = await Promise.all(
          data.map(async (restaurant: any) => {
            try {
              const imgRes = await fetch(
                `${API_BASE_URL}/reviews/restaurant/${restaurant.id}/images?limit=1`
              )
              const imgs = await imgRes.json()
              const image = imgs[0]?.url ?? "/default-restaurant.png"

              return {
                ...restaurant,
                image,
              }
            } catch {
              return {
                ...restaurant,
                image: "/default-restaurant.png",
              }
            }
          })
        )

        setRestaurants(restaurantsWithImages)
      } catch (err) {
        console.error("Failed to fetch top restaurants:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">Restaurants in Munich</h1>
        <p className="text-gray-600 mb-6">
          Browse a selection of Munich's most sustainable restaurants.
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {restaurants.map((rest) => (
              <div key={rest.id} className="mb-4">
                <RestaurantCard {...rest} variant="middle" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
