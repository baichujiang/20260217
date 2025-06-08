"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
} from "@/components/ui/drawer"
import { Clock, Heart, LocateFixed } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"





const Hotel = () => <span className="mr-2">🏨</span>
const Restaurant = () => <span className="mr-2">🍽️</span>
const MapPin = () => <span className="mr-2">📍</span>
const Search = () => <span className="mr-2">🔍</span>

const slideshowImages = ["/mensa-1.jpg", "/mensa-2.jpg"]

export default function Home() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFading, setIsFading] = useState(false)
    const [showSearchInput, setShowSearchInput] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const interval = setInterval(() => {
            setIsFading(true)
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length)
                setIsFading(false)
            }, 500)
        }, 5000)
        return () => clearInterval(interval)
    }, [])



    return (
        <main className="relative min-h-screen bg-white overflow-hidden">
            {/* Header */}
            <div className="absolute top-5 left-0 right-0 px-6 flex items-center justify-between z-50">
                {/* Logo on the left */}
                {/* Logo that links to home */}
                <Link href="/" className="shrink-0">
                    <Image src="/LeafMilesLogo.png" alt="LEAFMIILES Logo" width={50} height={50}/>
                </Link>

                {/* Centered search button */}
                <div className="flex-1 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => setShowSearchInput(prev => !prev)}
                        className="flex items-center"
                    >
                        <Search className="mr-2"/> Search
                    </Button>
                </div>

                {/* Menu button on the right */}
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button className="ml-2">☰ Menu</Button>
                    </DrawerTrigger>
                    <DrawerContent className="z-[150] bg-white shadow-lg rounded-lg max-w-sm mx-auto p-4">
                        <div className="space-y-4">
                            <Button variant="ghost" className="w-full justify-start">
                                <Hotel/> Hotel
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <Restaurant/> Restaurant
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                <MapPin/> Tourist Spot
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>


            {/* Search Input */}
            {showSearchInput && (
                <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="border px-4 py-2 rounded-lg shadow"
                    />
                </div>
            )}

            {/* Tree Section */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center z-10">
                <Link href="/tree" passHref>
                  <motion.div
                      whileHover={{scale: 1.1, rotate: 5}}
                      transition={{duration: 0.4, ease: "easeInOut"}}
                      className="mx-auto w-[300px] h-[300px]"
                  >
                      <Image
                          src="/tree.svg"
                          alt="Tree"
                          width={300}
                          height={300}
                          className="rounded-md w-full h-full"
                      />
                  </motion.div>
                </Link>
                <div className="mt-4 text-green-700 font-semibold text-xl shadow-sm">
                    Water your tree!
                </div>
            </div>


            <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 z-10">
                <Link href="/rating" passHref>
                    <motion.div
                        className="w-[200px] shadow-lg rounded-xl overflow-hidden cursor-pointer"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                        transition={{type: "spring", stiffness: 300}}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={slideshowImages[currentImageIndex]}
                                src={slideshowImages[currentImageIndex]}
                                alt="Slideshow"
                                width={200}
                                height={150}
                                className="rounded-xl object-cover w-full h-[150px]"
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.5}}
                            />
                        </AnimatePresence>
                    </motion.div>
                </Link>
            </div>


            {/* Footer */}
            <div className="fixed bottom-0 w-full bg-white border-t p-4 flex justify-around">
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.95}}
                    className="flex flex-col items-center text-gray-700"
                >
                    <Clock className="mb-1"/>
                    <span className="text-xs">Recents</span>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.95}}
                    className="flex flex-col items-center text-gray-700"
                >
                    <Heart className="mb-1"/>
                    <span className="text-xs">Favorites</span>
                </motion.button>
                <motion.button
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.95}}
                    className="flex flex-col items-center text-gray-700"
                >
                    <LocateFixed className="mb-1"/>
                    <span className="text-xs">Nearby</span>
                </motion.button>
            </div>

        </main>
    )
}
