"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/Header"

export default function HotelPage() {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
    const [firstSelection, setFirstSelection] = useState<"marienplatz" | "tum" | null>(null)
    const [secondSelection, setSecondSelection] = useState<"marienplatz" | "tum" | null>(null)

    const recommendations = [
        { name: "Hotel Königshof", description: "Conveniently located between Marienplatz and Garching." },
        { name: "NH Collection München", description: "Ideal for city center access and TUM visits." },
        { name: "Leonardo Royal Hotel", description: "Great transport connections to both locations." },
    ]

    const getMapSrc = () => {
        if (step === 4) return "/munich-map.png"
        return "/munich-original-map.png"
    }

    return (
        <main className="min-h-screen bg-white">
            <Header />

            <div className="p-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-semibold mb-4">🏨 Hotels in Munich</h1>
                <p className="text-gray-600 mb-6">
                    Select two destinations to see recommended hotels in between.
                </p>

                {/* Map */}
                <div className="w-full h-64 relative mb-6 rounded-lg overflow-hidden shadow">
                    <Image
                        src={getMapSrc()}
                        alt="Munich Map"
                        fill
                        className="object-cover transition duration-500 ease-in-out"
                    />
                </div>

                {/* Step 1: Choose first destination */}
                {step === 1 && (
                    <div className="space-y-4 mb-6">
                        <h2 className="text-lg font-medium">Choose your first destination</h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div
                                onClick={() => {
                                    setFirstSelection("marienplatz")
                                    setStep(2)
                                }}
                                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 w-full text-center"
                            >
                                Marienplatz
                            </div>
                            <div
                                onClick={() => {
                                    setFirstSelection("tum")
                                    setStep(2)
                                }}
                                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 w-full text-center"
                            >
                                TUM Garching
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Choose second destination */}
                {step === 2 && (
                    <div className="space-y-4 mb-6">
                        <h2 className="text-lg font-medium">Choose your second destination</h2>
                        {firstSelection === "marienplatz" && (
                            <div
                                onClick={() => {
                                    setSecondSelection("tum")
                                    setStep(3)
                                }}
                                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 w-full text-center"
                            >
                                TUM Garching
                            </div>
                        )}
                        {firstSelection === "tum" && (
                            <div
                                onClick={() => {
                                    setSecondSelection("marienplatz")
                                    setStep(3)
                                }}
                                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 w-full text-center"
                            >
                                Marienplatz
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Confirm */}
                {step === 3 && (
                    <div className="space-y-4 mb-6">
                        <h2 className="text-lg font-medium">Confirm your selection</h2>
                        <div className="border rounded-lg p-4">
                            <p>
                                From{" "}
                                <strong>
                                    {firstSelection === "marienplatz" ? "Marienplatz" : "TUM Garching"}
                                </strong>{" "}
                                to{" "}
                                <strong>
                                    {secondSelection === "marienplatz" ? "Marienplatz" : "TUM Garching"}
                                </strong>
                            </p>
                        </div>
                        <Button onClick={() => setStep(4)} className="w-full">
                            Show Recommendations
                        </Button>
                    </div>
                )}

                {/* Step 4: Recommendations */}
                <AnimatePresence>
                    {step === 4 && (
                        <motion.div
                            key="recommendations"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-4"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                Recommended Hotels Between{" "}
                                {firstSelection === "marienplatz" ? "Marienplatz" : "TUM Garching"} and{" "}
                                {secondSelection === "marienplatz" ? "Marienplatz" : "TUM Garching"}
                            </h2>
                            {recommendations.map((hotel, idx) => (
                                <div
                                    key={idx}
                                    className="border rounded-lg p-4 shadow hover:shadow-md transition"
                                >
                                    <h3 className="font-medium">{hotel.name}</h3>
                                    <p className="text-gray-600">{hotel.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    )
}
