"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
  UserCircle,
  Search,
} from "lucide-react"

export default function MainHeader() {
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/restaurant-search?name=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchInput(false)
      setSearchQuery("")
    }
  }

  return (
    <div className="sticky top-0 z-50 bg-white border-b">
        <div className="px-6 flex items-center justify-between h-16">
            
            {/* Left: Drawer + Logo */}
            <div className="flex items-center space-x-4">
            <Drawer>
                <DrawerTrigger asChild>
                <Button className="w-10 h-10 p-2 rounded-full flex items-center justify-center hover:bg-gray-100">
                    ☰
                </Button>
                </DrawerTrigger>
                <DrawerContent className="h-full w-64 bg-white shadow-lg rounded-none p-4 fixed top-0 left-0">
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
                    <Link href="/top-restaurants" className="w-full">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Utensils className="w-5 h-5" />
                        Restaurant
                    </Button>
                    </Link>
                </div>
                </DrawerContent>
            </Drawer>

            <Link href="/" className="flex items-center space-x-2">
                <Image src="/LeafMilesLogo.png" alt="LEAFMILES Logo" width={40} height={40} />
                <Image src="/LeafMiles.png" alt="LeafMiles Text Logo" width={80} height={40} />
            </Link>
            </div>

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

        {/* Search Input */}
        {showSearchInput && (
            <form
            onSubmit={handleSearchSubmit}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search restaurants..."
                className="w-full border px-4 py-2 rounded-lg shadow"
            />
            </form>
        )}
    </div>
  )
}
