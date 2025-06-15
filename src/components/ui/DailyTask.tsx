"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const tasks = [
    {
        title: "Share a review",
        bonus: 3,
        description: "Post a review for any location today.",
    },
    {
        title: "View 10 hotels",
        bonus: 3,
        description: "Explore at least 10 hotel pages today.",
    },
    {
        title: "Check 5 restaurants",
        bonus: 2,
        description: "View at least 5 different restaurant listings.",
    },
]

export default function DailyTasksSection() {
    return (
        <section className="mt-8 px-4 z-10 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-green-800 mb-4">🌿 Daily Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tasks.map((task, idx) => (
                    <Card
                        key={idx}
                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-semibold text-gray-800">
                                    {task.title}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {task.description}
                                </p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 font-medium text-xs py-1 px-2">
                                +{task.bonus} pts
                            </Badge>
                        </div>
                        <div className="mt-2 text-right">
                            <CheckCircle className="w-5 h-5 text-green-400 inline-block" />
                            <span className="text-sm text-green-600 ml-1">Not completed</span>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    )
}