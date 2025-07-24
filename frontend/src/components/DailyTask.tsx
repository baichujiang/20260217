"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"


const tasks = [
    {
        key: "writeReview",
        title: "Write a review",
        bonus: 3,
        description: "Share your experience to others in the community.",
        link: "/top-restaurants",
    },
    {
        key: "checkIn",
        title: "Daily check in",
        bonus: 3,
        description: "Don't forget to check in on your profile page today.",
        link: "/account/profile",
    },
    {
        key: "waterTree",
        title: "Water your tree",
        bonus: 2,
        description: "Your tree needs you! Water it to keep it thriving.",
        link: "/tree",
    },
]

export default function DailyTasksSection() {
  return (
    <section className="mt-8 z-10 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold text-[#1a543cff] mb-4 px-4">🌿 Daily Tasks</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
        {tasks.map((task, idx) => (
          <Link href={`${task.link}`} key={idx}>
            <Card className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all cursor-pointer">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                </div>
                <Badge className="bg-green-50 text-[#1a543cff] font-medium text-xs py-1 px-2">
                  +{task.bonus} pts
                </Badge>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
