'use client'

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import clsx from "clsx"
import { toast } from "sonner"

const categories = ["Food", "Service", "Environment", "Sourcing", "Waste", "Menu", "Energy"]
const sourcingTags = ["Local ingredients", "Organic produce", "Seasonal menu", "Source labeling", "Farm partnerships"]
const wasteTags = ["Reusable packaging", "No single-use plastics", "Paperless receipts", "Food donations"]
const menuTags = ["Vegetarian options", "Vegan options", "Gluten-free options", "Balanced portion sizes", "Seasonal rotation"]
const energyTags = ["Natural lighting", "Green energy use advertised"]    


export default function ReviewForm({ restaurantId }: { restaurantId: string }) {
const [ratings, setRatings] = useState<Record<string, number>>({})
const [experience, setExperience] = useState("")
const [selectedTags, setSelectedTags] = useState<string[]>([])
const [isSubmitting, setIsSubmitting] = useState(false)

const handleRating = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }))
}

const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
        prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
}

const handleSubmit = async () => {
    setIsSubmitting(true)

    const payload = {
        ratings,
        experience,
        sourcingTags: selectedTags,
        restaurantId: {restaurantId},
    }

    try {
        // TODO: use real endpoints
        const res = await fetch("http://localhost:4000/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (res.ok) {
            toast.success("Review submitted successfully!")
            // Optionally reset form
            setRatings({})
            setExperience("")
            setSelectedTags([])
        } else {
            toast.error("Failed to submit review")
        }
    } catch (error) {
        toast.error("Network error")
        console.error(error)
    } finally {
        setIsSubmitting(false)
    }
}

const [restaurantName, setRestaurantName] = useState("")

useEffect(() => {
    async function fetchRestaurantName() {
        try {
            const res = await fetch(`http://localhost:4000/restaurants/${restaurantId}`)
            const data = await res.json()
            setRestaurantName(data.name)
        } catch (err) {
            console.error("Failed to fetch restaurant name", err)
        }
    }

    fetchRestaurantName()
}, [restaurantId])


return (
    <div className="space-y-6">
        <h2 className="text-lg font-semibold">{restaurantName || "Loading..."}</h2>


        {/* Ratings */}
        <div className="space-y-3">
            {categories.map(category => (
            <div key={category} className="flex items-center gap-4">
                <span className="w-24 text-sm">{category}</span>
                <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(i => (
                    <Star
                    key={i}
                    size={20}
                    className={clsx(
                        "cursor-pointer",
                        i <= (ratings[category] || 0) ? "fill-black text-black" : "text-gray-400"
                    )}
                    onClick={() => handleRating(category, i)}
                    />
                ))}
                </div>
            </div>
            ))}
        </div>

        {/* Experience Textarea */}
        <Textarea
            placeholder="Share your experience"
            value={experience}
            onChange={e => setExperience(e.target.value)}
            className="min-h-[100px]"
        />

        {/* Sourcing Tags */}
        <div className="space-y-2">
            <h3 className="font-semibold text-sm">Sourcing</h3>
            <div className="flex flex-wrap gap-2">
            {sourcingTags.map(tag => (
                <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="rounded-full text-sm"
                onClick={() => toggleTag(tag)}
                type="button"
                >
                {tag}
                </Button>
            ))}
            </div>
        </div>

        {/* Waste Tags */}
        <div className="space-y-2">
            <h3 className="font-semibold text-sm">Waste</h3>
            <div className="flex flex-wrap gap-2">
            {wasteTags.map(tag => (
                <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="rounded-full text-sm"
                onClick={() => toggleTag(tag)}
                type="button"
                >
                {tag}
                </Button>
            ))}
            </div>
        </div>

        {/* Menu Tags */}
        <div className="space-y-2">
            <h3 className="font-semibold text-sm">Sourcing</h3>
            <div className="flex flex-wrap gap-2">
            {menuTags.map(tag => (
                <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="rounded-full text-sm"
                onClick={() => toggleTag(tag)}
                type="button"
                >
                {tag}
                </Button>
            ))}
            </div>
        </div>

        {/* Energy Tags */}
        <div className="space-y-2">
            <h3 className="font-semibold text-sm">Sourcing</h3>
            <div className="flex flex-wrap gap-2">
            {energyTags.map(tag => (
                <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="rounded-full text-sm"
                onClick={() => toggleTag(tag)}
                type="button"
                >
                {tag}
                </Button>
            ))}
            </div>
        </div>
        <div className="space-y-6 pb-4"></div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 w-full p-4 sm:static sm:border-none sm:p-0">
            <div className="max-w-md mx-auto">
            <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            </div>
        </div>

    </div>
    )
}
