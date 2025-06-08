"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { HeaderStats } from "../../components/HeaderStats"
import { Leaderboard, User } from "../../components/Leaderboard"
import { Progress } from "../../components/ui/progress"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
  type CarouselApi,
} from "../../components/ui/carousel"
import { Button } from "../../components/ui/button"
import { Droplet } from "lucide-react"

export interface TreeData {
  src: string
  current: number
  max: number
}

export default function TreePage() {
  const [trees, setTrees] = useState<TreeData[]>([
    { src: "/apple_tree.png", current: 30, max: 100 },
    { src: "/banana_tree.png", current: 60, max: 100 },
    { src: "/orange_tree.png", current: 100, max: 100 },
  ])
  const badges = 10
  const [users, setUsers] = useState<User[]>([])
  const [greenPoints, setGreenPoints] = useState<number>(999)
  const [emblaApi, setEmblaApi] = useState<CarouselApi | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setActiveIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    fetch("http://localhost:4000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(console.error)
  }, [])

  function handleWater(index: number) {
    if (trees[index].current < trees[index].max && greenPoints >= 10) {
      setGreenPoints((prev) => prev - 10)
      setTrees((prev) =>
        prev.map((t, i) =>
          i === index ? { ...t, current: Math.min(t.current + 10, t.max) } : t
        )
      )
    }
  }

  function handleHarvest(index: number) {
    setTrees((prev) =>
      prev.map((t, i) => (i === index ? { ...t, current: 0 } : t))
    )
  }

  function goPrev() {
    emblaApi?.scrollPrev()
  }

  function goNext() {
    emblaApi?.scrollNext()
  }

  return (
    <div className="min-h-screen">
      <section className="relative">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-green-200 -z-10" />
        <div className="absolute inset-x-0 top-0 h-full bg-[url('/background.png')] bg-cover bg-bottom -z-10" />
        <div className="p-4 pb-0">
          <HeaderStats badges={badges} greenPoints={greenPoints} />

          <div className="relative w-full">
          <button
          onClick={goPrev}
          className="absolute top-1/2 -translate-y-1/2 left-2 z-10 p-2 w-12 h-12 flex items-center justify-center text-white border-2 border-white rounded-full transition hover:ring-2 hover:ring-white hover:bg-white/10 backdrop-blur"
          >
            ❮
          </button>
            <Carousel setApi={setEmblaApi} opts={{ loop: true }}>
              <CarouselContent className="p-4 pb-6">
                {trees.map(({ src, current, max }, idx) => (
                  <CarouselItem
                    key={idx}
                    className="relative flex flex-col items-center justify-end space-y-4 min-h-[400px]"
                  >
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleWater(idx)}
                      disabled={current >= max || greenPoints < 10}
                      title="Water Plant"
                      className="absolute top-2 right-1 p-1 bg-transparent border-none shadow-none hover:ring-2 hover:ring-green-400 hover:ring-offset-2 transition hover:scale-105 active:animate-wiggle"
                    >
                      <Image
                        src="/kettle.png"
                        alt="Watering Kettle"
                        width={96}
                        height={96}
                      />
                    </Button>

                    <div className="relative w-64 h-64">
                      <Image
                        src={src}
                        alt={`Tree ${idx + 1}`}
                        fill
                        className="object-cover object-bottom rounded-lg"
                      />
                    </div>

                    <div className="relative w-full px-4">
                      {current === max && (
                        <div className="absolute -top-6 right-4 flex items-center gap-2 animate-bounce">
                          <Image
                            src="/fruit.png"
                            alt="Fruit"
                            width={32}
                            height={32}
                          />
                          <button
                            onClick={() => handleHarvest(idx)}
                            className="text-xs bg-yellow-300 rounded px-2 py-1 font-semibold text-white shadow hover:bg-yellow-400 transition"
                          >
                            Harvest
                          </button>
                        </div>
                      )}
                      <Progress
                        value={(current / max) * 100}
                        size="md"
                        indicatorClassName="bg-green-500"
                        className="bg-gray-100"
                      />
                      <p className="text-center mt-2 text-lg font-semibold text-gray-900">
                        Growth: {current} / {max}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>

            <button
              onClick={goNext}
              className="absolute top-1/2 -translate-y-1/2 right-2 z-10 p-2 w-12 h-12 flex items-center justify-center text-white border-2 border-white rounded-full transition hover:ring-2 hover:ring-white hover:bg-white/10 backdrop-blur"
            >
              ❯
            </button>
          </div>
        </div>
      </section>
      <div className="-mt-6 px-4"></div>
      <Leaderboard users={users} />
    </div>
  )
}
