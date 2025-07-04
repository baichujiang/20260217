"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
} from "@/components/ui/drawer"
import {
    Search,
    ArrowLeft,
    UserCircle,
    Bed,
    Utensils,
    LocateFixed,
} from "lucide-react"

export function Header() {
    const [showSearchInput, setShowSearchInput] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const router = useRouter()

    return (
        <>
            <div className="sticky top-0 z-50 bg-white border-b">
                <div className="px-6 flex items-center justify-between h-16">
                    {/* Left: Menu + Back */}
                    <div className="flex items-center gap-2">
                        {/* ☰ Menu */}
                        <Drawer>
                            <DrawerTrigger asChild>
                                <Button className="w-10 h-10 p-2 rounded-full flex items-center justify-center hover:bg-gray-100">
                                    ☰
                                </Button>
                            </DrawerTrigger>

                            <DrawerContent className="h-full w-64 bg-white shadow-lg rounded-none p-4 fixed top-0 left-0">
                                <div className="space-y-4 mt-8">
                                    <Link href="/account" className="w-full">
                                        <Button variant="ghost" className="w-full justify-start gap-2">
                                            <UserCircle className="w-5 h-5" />
                                            Account
                                        </Button>
                                    </Link>
                                    <Link href="/hotel" className="w-full">
                                        <Button variant="ghost" className="w-full justify-start gap-2">
                                            <Bed className="w-5 h-5" />
                                            Hotel
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

                        {/* ← Back button */}
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="w-10 h-10 p-2 rounded-full flex items-center justify-center hover:bg-gray-100"
                            title="Go back"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Center: Logo */}
                    <Link href="/" className="shrink-0">
                        <div className="flex items-center space-x-2">
                            <Image
                                src="/LeafMilesLogo.png"
                                alt="LEAFMILES Logo"
                                width={40}
                                height={40}
                            />
                        </div>
                    </Link>

                    {/* Right: Search */}
                    <Button
                        variant="outline"
                        onClick={() => setShowSearchInput(prev => !prev)}
                        className="w-10 h-10 p-2 rounded-full flex items-center justify-center hover:bg-gray-100"
                    >
                        <Search className="w-5 h-5" />
                    </Button>
                </div>

                {/* Search Input */}
                {showSearchInput && (
                    <div className="bg-white px-6 pb-2">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full border px-4 py-2 rounded-lg shadow"
                        />
                    </div>
                )}
            </div>
        </>
    )
}
