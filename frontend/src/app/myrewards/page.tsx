"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/fetchWithAuth"
import { Header } from "@/components/ui/Header"

interface Reward {
  id: number
  tree: {
    type: {
      species: string
      image_src: string
    }
  }
  gift_type: string
  submitted_at: string
}

export default function MyRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await fetchWithAuth("http://localhost:8000/harvest/me/rewards")
        const data = await res.json()
        setRewards(data)
      } catch (e) {
        console.error("Failed to load rewards:", e)
      } finally {
        setLoading(false)
      }
    }

    fetchRewards()
  }, [])

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f0fdf4_35%,_white_40%)]">
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Rewards</h1>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : rewards.length === 0 ? (
          <p className="text-gray-500">No rewards yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
              >
                <img
                  src={r.tree?.type?.image_src || "/fallback.png"}
                  alt="tree"
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">
                     {r.tree.type.species} Tree →  {r.gift_type}
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted on: {new Date(r.submitted_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
