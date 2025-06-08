"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const fruitTrees = [
  { name: "Apple Tree", points: 50, src: "/apple_tree.png", href: "/" },
  { name: "Banana Tree", points: 50, src: "/banana_tree.png", href: "/" },
  { name: "Orange Tree", points: 50, src: "/orange_tree.png", href: "/" },
  { name: "Mango Tree", points: 70, src: "/mango_tree.png", href: "/" },
  { name: "Cherry Tree", points: 40, src: "/cherry_tree.png", href: "/" },
]

const otherRewards = [
  { name: "Artist", description: "Song", src: "/artist.png", href: "/" },
  { name: "Designer", description: "T-Shirt", src: "/designer.png", href: "/" },
  { name: "Writer", description: "E-Book", src: "/writer.png", href: "/" },
  { name: "Chef", description: "Recipe", src: "/chef.png", href: "/" },
]

export default function BadgesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-green-200 to-white">
      {/* 返回主界面按钮 */}
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/tree")}>
          ← Back to Tree
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Reward Selection</h1>

      {/* Fruit Trees - horizontal scroll */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-green-800 mb-2 pl-4">
          <span className="mr-2 text-green-600"></span> Fruit Trees
        </h2>
        <div className="pl-4 flex space-x-4 overflow-x-auto pb-2">
          {fruitTrees.map((tree) => (
            <Card
              key={tree.name}
              className="min-w-[200px] p-4 bg-white/80 rounded-lg shrink-0"
            >
              <Link href={tree.href} className="block">
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={tree.src}
                    alt={tree.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{tree.name}</h3>
                <p className="text-sm text-gray-600">
                  {tree.points} pts to mature
                </p>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Other types of rewards - horizontal scroll */}
      <section>
        <h2 className="text-xl font-bold text-green-800 mb-2 pl-4">
          <span className="mr-2 text-green-600"></span> Other types of rewards
        </h2>
        <div className="pl-4 flex space-x-4 overflow-x-auto pb-2">
          {otherRewards.map((item) => (
            <Card
              key={item.name}
              className="min-w-[200px] p-4 bg-white/80 rounded-lg shrink-0"
            >
              <Link href={item.href} className="block">
                <div className="relative w-full h-40 mb-4">
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
