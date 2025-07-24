"use client"

import TreeSection from "@/components/ui/TreeSection"
import ImageScrollSection from "@/components/ImageScrollSection"
import DailyTasksSection from "@/components/DailyTask"
import MainHeader from "@/components/MainHeader"

export default function Home() {

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
        <MainHeader />

        {/* Tree Section */}
        <TreeSection />

        {/* Restaurants Section */}
        <div className="mt-10 px-6">
            <h2 className="text-xl font-semibold text-[#1a543cff] mb-2">Top Sustainable Restaurants</h2>
            <p className="text-gray-500 mb-4">Browse and comment on the city's most eco-friendly dining spots.</p>
        </div>
        <div className="w-full px-4">
            <ImageScrollSection />
        </div>

        {/* Daily Tasks Section */}
        <DailyTasksSection />
    </main>

  )
}
