

"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

type Props = {
    completed?: {
        shareReview: boolean
        viewHotels: boolean
        checkRestaurants: boolean
    }
}

const defaultCompleted = {
    shareReview: false,
    viewHotels: false,
    checkRestaurants: false,
}

const tasks = [
    {
        key: "shareReview",
        title: "Share a review",
        bonus: 3,
        description: "Post a review for any location today.",
    },
    {
        key: "viewHotels",
        title: "View 10 hotels",
        bonus: 3,
        description: "Explore at least 10 hotel pages today.",
    },
    {
        key: "checkRestaurants",
        title: "Check 5 restaurants",
        bonus: 2,
        description: "View at least 5 different restaurant listings.",
    },
]

export default function DailyTasksSection({ completed = defaultCompleted }: Props) {
    return (
        <section className="mt-8 z-10 max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-green-800 mb-4 px-4">🌿 Daily Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                {tasks.map((task, idx) => {
                    const isDone = completed[task.key as keyof typeof completed]
                    const statusText = isDone ? "Completed" : "Not completed"
                    const statusColor = isDone ? "text-green-600" : "text-red-600"
                    const iconColor = isDone ? "text-green-500" : "text-red-500"

                    return (
                        <Card
                            key={idx}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800">{task.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                                </div>
                                <Badge className="bg-green-100 text-green-700 font-medium text-xs py-1 px-2">
                                    +{task.bonus} pts
                                </Badge>
                            </div>
                            <div className="mt-2 text-right">
                                <CheckCircle className={`w-5 h-5 inline-block ${iconColor}`} />
                                <span className={`text-sm ml-1 ${statusColor}`}>{statusText}</span>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </section>
    )
}
