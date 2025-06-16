"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TreeSection() {
    return (
        <div className="mt-10 px-4 z-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-green-50 p-4 rounded-xl shadow-md max-w-4xl mx-auto">
                {/* Left: Introduction */}
                <div className="text-left max-w-sm">
                    <h2 className="text-xl font-bold text-green-800 mb-1">Collect your bonus</h2>
                    <p className="text-gray-700 text-base leading-relaxed">
                        Water your tree daily and watch it grow. Your eco-activities contribute to a greener world. 🌱
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Every drop counts!</p>
                </div>

                {/* Right: Tree Image with animation */}
                <Link href="/tree" passHref>
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        whileHover={{ scale: 1.05 }}
                        className="w-[200px] h-[200px] md:w-[240px] md:h-[240px]"
                    >
                        <Image
                            src="/tree.svg"
                            alt="Tree"
                            width={240}
                            height={240}
                            className="rounded-md w-full h-full object-contain"
                        />
                    </motion.div>
                </Link>
            </div>
        </div>
    )
}
