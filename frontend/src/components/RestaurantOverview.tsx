import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Recycle, Leaf, Zap, MapPin, Globe2 } from "lucide-react"
import { JSX } from "react"

type ScoreItem = {
  label: "Sourcing" | "Waste" | "Menu" | "Energy"
  score: number
}

type RestaurantInfo = {
  address: string
  website: string
  scores: {
    sourcing_score: number
    waste_score: number
    menu_score: number
    energy_score: number
  }
}

const icons: Record<ScoreItem["label"], JSX.Element> = {
  Sourcing: <ShieldCheck className="w-5 h-5" />,
  Waste: <Recycle className="w-5 h-5" />,
  Menu: <Leaf className="w-5 h-5" />,
  Energy: <Zap className="w-5 h-5" />,
}

export default async function RestaurantOverview() {
  const res = await fetch("http://localhost:4000/restaurants/1", {
    cache: "force-cache" // default, but you can use "no-store" for dynamic content
  })
  const data: RestaurantInfo = await res.json()

  const scores: ScoreItem[] = [
    { label: "Sourcing", score: data.scores.sourcing_score },
    { label: "Waste", score: data.scores.waste_score },
    { label: "Menu", score: data.scores.menu_score },
    { label: "Energy", score: data.scores.energy_score }
  ]

  return (
    <main>
        <div className="space-y-3 text-sm text-gray-800">
            <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-black mt-0.5" />
            <p>{data.address}</p>
            </div>
            <div className="flex items-start gap-2">
            <Globe2 className="w-5 h-5 text-black mt-0.5" />
            <p className="truncate">{data.website}</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-3 max-w-md mx-auto mt-6">
            {scores.map(({ label, score }) => (
            <Card key={label} className="rounded-3xl border border-gray-200 shadow-sm">
                <CardContent className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                    {icons[label]}
                    {label}
                </div>
                <div className="text-sm font-semibold">{score.toFixed(1)}</div>
                </CardContent>
            </Card>
            ))}
        </div>
    </main>
  )
}
