"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

const restaurantData = [
    {
        id: "mensa1",
        name: "Mensa",
        src: "/mensa-1.jpg",
        score: 4.5,
        susScore: 4.0,
    },
    {
        id: "mensa2",
        name: "Mensa 2",
        src: "/mensa-2.jpg",
        score: 4.0,
        susScore: 3.8,
    },
    {
        id: "1",
        name: "Bavarian Haus",
        src: "/restaurants/R1.jpeg",
        score: 4.6,
        susScore: 4.3,
    },
    {
        id: "2",
        name: "Wirtshaus am Markt",
        src: "/restaurants/R2.jpeg",
        score: 4.4,
        susScore: 4.1,
    },
    {
        id: "3",
        name: "Augustiner Bräustuben",
        src: "/restaurants/R3.jpeg",
        score: 4.7,
        susScore: 4.5,
    },
    {
        id: "5",
        name: "Paulaner Bräuhaus",
        src: "/restaurants/R5.jpeg",
        score: 4.5,
        susScore: 4.0,
    },
    {
        id: "10",
        name: "Spatenhaus an der Oper",
        src: "/restaurants/R10.jpeg",
        score: 4.5,
        susScore: 4.2,
    },
]

export default function ImageScrollSection() {
    return (
        <div className="mt-10 px-4 overflow-x-auto whitespace-nowrap scroll-smooth snap-x snap-mandatory z-10">
            <div className="flex space-x-4">
                {restaurantData.map((restaurant) => (
                    <Link href={`/rating?id=${restaurant.id}`} key={restaurant.id}>
                        <motion.div
                            className="min-w-[200px] snap-start shadow-lg rounded-xl overflow-hidden cursor-pointer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Image
                                src={restaurant.src}
                                alt={restaurant.name}
                                width={200}
                                height={150}
                                className="rounded-xl object-cover w-full h-[150px]"
                            />
                            <div className="p-2">
                                <p className="text-sm font-semibold text-gray-800 truncate">{restaurant.name}</p>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant="outline" className="text-xs">
                                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                        {restaurant.score}
                                    </Badge>
                                    <Badge variant="outline" className="text-green-500 text-xs">
                                        <Star className="w-3 h-3 mr-1" fill="currentColor" />
                                        {restaurant.susScore}
                                    </Badge>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
