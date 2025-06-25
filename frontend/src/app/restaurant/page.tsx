"use client"

import Image from "next/image"
import { Header } from "@/components/ui/Header"

const restaurants = [
    { name: "Bavarian Haus", location: "Marienplatz", rating: 4.6, image: "/restaurants/R1.jpeg" },
    { name: "Wirtshaus am Markt", location: "Viktualienmarkt", rating: 4.4, image: "/restaurants/R2.jpeg" },
    { name: "Augustiner Bräustuben", location: "Landsberger Str.", rating: 4.7, image: "/restaurants/R3.jpeg" },
    { name: "Gasthaus zur Post", location: "Sendlinger Tor", rating: 4.3, image: "/restaurants/R4.jpeg" },
    { name: "Paulaner Bräuhaus", location: "Kapuzinerplatz", rating: 4.5, image: "/restaurants/R5.jpeg" },
    { name: "Haxnbauer", location: "Sparkassenstraße", rating: 4.2, image: "/restaurants/R6.jpeg" },
    { name: "Schneider Bräuhaus", location: "Talstraße", rating: 4.1, image: "/restaurants/R7.jpeg" },
    { name: "Zum Franziskaner", location: "Residenzstraße", rating: 4.0, image: "/restaurants/R8.jpeg" },
    { name: "Andechser am Dom", location: "Frauenplatz", rating: 4.4, image: "/restaurants/R9.jpeg" },
    { name: "Spatenhaus an der Oper", location: "Max-Joseph-Platz", rating: 4.5, image: "/restaurants/R10.jpeg" },
]

export default function RestaurantPage() {
    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-semibold mb-4">🍽️ Restaurants in Munich</h1>
                <p className="text-gray-600 mb-6">
                    Browse a selection of Munich's most loved restaurants.
                </p>

                <div className="space-y-6">
                    {restaurants.map((rest, index) => (
                        <div
                            key={index}
                            className="flex gap-4 items-start bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition p-4"
                        >
                            <div className="w-40 h-28 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                <Image
                                    src={rest.image}
                                    alt={rest.name}
                                    width={160}
                                    height={120}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">{rest.name}</h2>
                                <p className="text-sm text-gray-600">{rest.location}</p>
                                <p className="text-sm text-yellow-600">⭐ {rest.rating}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
