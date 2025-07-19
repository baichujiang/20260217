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

        {/* Daily Tasks Section */}
        <DailyTasksSection />

        {/* Image Scroll Section */}
        <section className="mt-10 px-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommendations for You</h2>
            <ImageScrollSection />
        </section>
    </main>

  )
}
