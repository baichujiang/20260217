"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import GoogleMap from "@/components/ui/GoogleMap";

export default function HotelPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [places, setPlaces] = useState<string[]>([""]);
    const [focusedInput, setFocusedInput] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const allDestinations = [
        "Marienplatz",
        "TUM Garching",
        "English Garden",
        "Nymphenburg Palace",
        "Deutsches Museum",
        "Olympiapark",
        "Viktualienmarkt",
        "BMW Welt",
    ];

    const destinationCoords: Record<string, [number, number]> = {
        "Marienplatz": [48.1374, 11.5755],
        "TUM Garching": [48.2620, 11.6670],
        "English Garden": [48.1640, 11.6033],
        "Nymphenburg Palace": [48.1585, 11.5021],
        "Deutsches Museum": [48.1303, 11.5840],
        "Olympiapark": [48.1741, 11.5463],
        "Viktualienmarkt": [48.1351, 11.5766],
        "BMW Welt": [48.1766, 11.5566],
    };

    const hotels = [
        {
            name: "Hotel Königshof",
            description: "Luxury stay near Marienplatz.",
            rating: 4.7,
            coords: [48.1391, 11.5658],
        },
        {
            name: "NH Collection München",
            description: "Perfect for city explorers.",
            rating: 4.5,
            coords: [48.1366, 11.5720],
        },
        {
            name: "Leonardo Royal Hotel",
            description: "Close to Olympiapark and BMW Welt.",
            rating: 4.3,
            coords: [48.1790, 11.5530],
        },
        {
            name: "Holiday Inn Munich City Centre",
            description: "Modern hotel by the Deutsches Museum.",
            rating: 4.4,
            coords: [48.1290, 11.5940],
        },
        {
            name: "Motel One München-Deutsches Museum",
            description: "Affordable comfort in the heart of Munich.",
            rating: 4.2,
            coords: [48.1260, 11.5840],
        },
        {
            name: "Hilton Munich Park",
            description: "Overlooking the English Garden.",
            rating: 4.6,
            coords: [48.1570, 11.5980],
        },
        {
            name: "Pullman Munich",
            description: "Elegant hotel near Leopoldstrasse.",
            rating: 4.3,
            coords: [48.1650, 11.5900],
        },
    ];

    const selectedDestinations = places
        .filter((p) => p.trim() !== "")
        .map((p) => {
            const key = Object.keys(destinationCoords).find(
                (k) => k.toLowerCase() === p.trim().toLowerCase()
            );
            return key ? { name: key, coords: destinationCoords[key] } : null;
        })
        .filter(
            (d): d is { name: string; coords: [number, number] } => !!d
        );

    return (
        <main className="min-h-screen bg-gray-50">
            <Header />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Hotels in Munich</h1>

                {step === 1 && (
                    <div className="bg-white border rounded-lg p-6 space-y-4 shadow">
                        <h2 className="text-lg font-semibold text-gray-800">Select Destinations</h2>
                        <div className="space-y-4 relative">
                            {places.map((place, idx) => {
                                const suggestions =
                                    place.trim() === ""
                                        ? []
                                        : allDestinations.filter((d) =>
                                            d.toLowerCase().includes(place.toLowerCase())
                                        );
                                return (
                                    <div key={idx} className="relative flex items-center gap-2">
                                        <button
                                            disabled={places.length <= 1}
                                            onClick={() =>
                                                setPlaces(places.filter((_, i) => i !== idx))
                                            }
                                            className="text-gray-500 hover:text-red-500 text-lg font-bold px-2"
                                            type="button"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="text"
                                            value={place}
                                            onFocus={() => setFocusedInput(idx)}
                                            onBlur={() => {
                                                setTimeout(() => setFocusedInput(null), 100);
                                            }}
                                            onChange={(e) => {
                                                const newPlaces = [...places];
                                                newPlaces[idx] = e.target.value;
                                                setPlaces(newPlaces);
                                            }}
                                            placeholder={`Destination ${idx + 1}`}
                                            className="w-full border rounded p-2 focus:ring focus:border-blue-400"
                                        />
                                        {focusedInput === idx && suggestions.length > 0 && (
                                            <div className="absolute z-10 bg-white border w-full mt-1 rounded shadow left-8">
                                                {suggestions.map((s, sIdx) => (
                                                    <div
                                                        key={sIdx}
                                                        onClick={() => {
                                                            const newPlaces = [...places];
                                                            newPlaces[idx] = s;
                                                            setPlaces(newPlaces);
                                                            setFocusedInput(null);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        {s}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setPlaces([...places, ""])}
                            >
                                + Add destination
                            </Button>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button
                            onClick={() => {
                                const filled = places.filter((p) => p.trim() !== "");
                                if (filled.length < 1) {
                                    setError("Please enter at least 1 destination.");
                                    return;
                                }
                                setError(null);
                                setStep(2);
                            }}
                            className="w-full mt-2"
                        >
                            Continue
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="bg-white border rounded-lg p-6 space-y-4 shadow">
                        <h2 className="text-lg font-semibold text-gray-800">Confirm Destinations</h2>
                        <ul className="list-disc pl-5 text-gray-700">
                            {selectedDestinations.map((d, idx) => (
                                <li key={idx}>{d.name}</li>
                            ))}
                        </ul>
                        <GoogleMap
                            destinations={selectedDestinations}
                            hotels={[]} // No hotels in step 2
                            zoom={13}
                        />
                        <Button onClick={() => setStep(3)} className="w-full">
                            Show Recommendations
                        </Button>
                    </div>
                )}

                <AnimatePresence>
                    {step === 3 && (
                        <motion.div
                            key="recommendations"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="space-y-4"
                        >
                            <div className="bg-white border rounded-lg p-6 shadow space-y-4">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Recommended Hotels
                                </h2>
                                <GoogleMap
                                    destinations={selectedDestinations}
                                    hotels={hotels}
                                    zoom={13}
                                />
                                <div className="grid gap-4">
                                    {hotels.map((hotel, idx) => (
                                        <div
                                            key={idx}
                                            className="border rounded-lg p-4 hover:shadow transition bg-gray-50"
                                        >
                                            <h3 className="font-medium text-gray-800">
                                                {hotel.name}{" "}
                                                <span className="text-yellow-500">★ {hotel.rating}</span>
                                            </h3>
                                            <p className="text-gray-600">{hotel.description}</p>
                                            <ul className="text-sm text-gray-500 mt-2 space-y-1">
                                                {selectedDestinations.map((dest, destIdx) => {
                                                    // Fake times: 5–25 min randomly
                                                    const fakeMinutes = Math.floor(Math.random() * 21) + 5;
                                                    return (
                                                        <li key={destIdx}>
                                                            ~{fakeMinutes} min to {dest.name}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={() => {
                                        setStep(1);
                                        setPlaces([""]);
                                    }}
                                    className="w-full"
                                >
                                    Start Over
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
