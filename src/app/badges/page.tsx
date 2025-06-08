// src/app/badges/page.tsx

"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

const categories = [
  {
    name: "Green Movers",
    items: [
      { label: "Badge A", src: "/badge-a.png" },
      { label: "Badge B", src: "/badge-b.png" },
      { label: "Badge C", src: "/badge-c.png" },
      { label: "Badge D", src: "/badge-d.png" },
    ],
  },
  {
    name: "Conscious Shoppers",
    items: [
      { label: "Badge E", src: "/badge-e.png" },
      { label: "Badge F", src: "/badge-f.png" },
      { label: "Badge G", src: "/badge-g.png" },
    ],
  },
  {
    name: "Carbon Cutters",
    items: [
      { label: "Badge H", src: "/badge-h.png" },
      { label: "Badge I", src: "/badge-i.png" },
      { label: "Badge J", src: "/badge-j.png" },
    ],
  },
]

export default function BadgesPage() {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  const toggle = (name: string) => {
    setOpenMap((prev) => ({ ...prev, [name]: !prev[name] }))
  }
  const router = useRouter()

  return (

    <div className="min-h-screen bg-gradient-to-b from-green-200 to-white p-6">
      {/* 返回主界面按钮 */}
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/tree")}>
          ← Back to Tree
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Badges</h1>

      {categories.map((cat) => {
        const isOpen = openMap[cat.name] || false
        return (
          <div key={cat.name} className="mb-6 bg-white/80 rounded-lg">
            <div className="relative border-b">
              <h2 className="text-2xl font-semibold text-center py-4">
                {cat.name}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => toggle(cat.name)}
              >
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </div>
            {isOpen && (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {cat.items.map((item) => (
                  <Card key={item.label} className="p-2 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-2">
                      <Image
                        src={item.src}
                        alt={item.label}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
