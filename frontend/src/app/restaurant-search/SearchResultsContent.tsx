"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import RestaurantList from "@/components/RestaurantList"
import { RestaurantCardProps } from "@/types/restaurant"
import { Header } from "@/components/Header"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("name") || ""
  const [restaurants, setRestaurants] = useState<RestaurantCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!query) return

    const fetchResults = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/restaurants/search?name=${encodeURIComponent(query)}`)
        const data = await res.json()

        const restaurantsWithImages = await Promise.all(
          data.map(async (restaurant: any) => {
            try {
              const imgRes = await fetch(`${API_BASE_URL}/reviews/restaurant/${restaurant.id}/images?limit=1`)
              const imgs = await imgRes.json()
              const image = imgs[0]?.url ?? "/default-restaurant.png"

              return { ...restaurant, image }
            } catch {
              return { ...restaurant, image: "/default-restaurant.png" }
            }
          })
        )

        setRestaurants(restaurantsWithImages)
      } catch (err) {
        console.error("Failed to fetch search results:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <RestaurantList
            restaurants={restaurants}
            variant="middle"
            title="Search Results"
            description={`Results for “${query}”`}
          />
        )}
      </div>
    </main>
  )
}
