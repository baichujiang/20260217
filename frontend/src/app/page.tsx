"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
} from "@/components/ui/drawer"
import {
    Bed,
    Utensils,
    Heart,
    LocateFixed,
    UserCircle,
    Search,
} from "lucide-react"
import TreeSection from "@/components/ui/TreeSection"
import ImageScrollSection from "@/components/ImageScrollSection"
import DailyTasksSection from "@/components/DailyTask"

export default function Home() {
    const [showSearchInput, setShowSearchInput] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    return (
        <main className="relative min-h-screen bg-white overflow-hidden">
            {/* Sticky Main Header */}
            <div className="sticky top-0 z-50 bg-white border-b">
                <div className="px-6 flex items-center justify-between h-16">
                    {/* Left: Menu */}
                    <Drawer>
                        <DrawerTrigger asChild>
                            <Button
                                className="w-10 h-10 p-2 rounded-full flex items-center justify-center hover:bg-gray-100"
                            >
                                ☰
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent
                            className="h-full w-64 bg-white shadow-lg rounded-none p-4 fixed top-0 left-0"
                        >
                            <div className="space-y-2 mt-4">
                                <Link href="/account" className="w-full">
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <UserCircle className="w-5 h-5" />
                                        Account
                                    </Button>
                                </Link>
                                <Link href="/hotel" className="w-full">
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <Bed className="w-5 h-5" />
                                        Hotel (demo)
                                    </Button>
                                </Link>
                                <Link href="/restaurant" className="w-full">
                                    <Button variant="ghost" className="w-full justify-start gap-2">
                                        <Utensils className="w-5 h-5" />
                                        Restaurant
                                    </Button>
                                </Link>

                            </div>
                        </DrawerContent>
                    </Drawer>

                    {/* Center: Logos */}
                    <Link href="/" className="shrink-0">
                        <div className="flex items-center space-x-2">
                            <Image src="/LeafMilesLogo.png" alt="LEAFMIILES Logo" width={40} height={40} />
                            <Image src="/LeafMiles.png" alt="Another Logo" width={40} height={40} />
                        </div>
                    </Link>

                    {/* Right: Account and Search */}
                    <div className="flex items-center space-x-2">
                        <Link href="/account">
                            <Button
                                variant="outline"
                                className="w-10 h-10 p-2 rounded-full flex items-center justify-center hover:bg-gray-100"
                            >
                                <UserCircle className="w-5 h-5" />
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => setShowSearchInput(prev => !prev)}
                            className="w-10 h-10 p-2 rounded-full flex items-center justify-center hover:bg-gray-100"
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            {showSearchInput && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full border px-4 py-2 rounded-lg shadow"
                    />
                </div>
            )}

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
