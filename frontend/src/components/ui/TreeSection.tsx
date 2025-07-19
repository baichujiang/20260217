"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./button"

export default function TreeSection() {
    return (
        <div className="mt-10 px-4 z-10">
            <div
                className="relative flex flex-col md:flex-row items-start justify-between gap-6 p-6 rounded-xl shadow-md max-w-4xl mx-auto bg-[url('/tree-bg.png')] bg-cover bg-center text-white"
            >
                <div className="absolute inset-0 bg-black/30 rounded-xl z-0" />
                    {/* Content (text + button) */}
                    <div className="relative z-10 flex flex-col gap-4 max-w-sm">
                    <h2 className="text-xl font-bold text-white">From Action to Leaf</h2>
                    <p className="text-white text-base leading-relaxed">
                        Water your tree daily and watch it grow. Your eco-activities contribute to a greener world.
                    </p>
                        <Button asChild className="bg-white text-[#1a543cff] hover:bg-gray-100 shadow px-6 py-2 w-30">
                            <Link href="/tree">Start Growing</Link>
                        </Button>
                </div>
            </div>

        </div>

    )
}
