"use client"

import { Header } from "@/components/ui/Header"

export default function RestaurantPage() {
    return (
        <main className="min-h-screen bg-white">
        <Header />

        <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">🍽️ Restaurant Name</h1>
    <p className="text-gray-700 mb-2">
          📍 Location: Marienplatz, Munich
    </p>
    <p className="text-gray-700 mb-2">
          ⏰ Open Hours: 11:00 AM – 10:00 PM
    </p>
    <p className="text-gray-700 mb-2">
          ⭐ Rating: 4.5 / 5
    </p>
    <p className="text-gray-600 mt-4">
        Welcome to one of the top-rated local restaurants, known for authentic Bavarian cuisine and cozy atmosphere.
    </p>
    </div>
    </main>
)
}
