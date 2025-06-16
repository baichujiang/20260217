'use client'

import { ArrowLeft, Share2, Bookmark, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"


export default function TopActionBar() {
  const router = useRouter()
  return (
    <div className="flex items-center justify-between px-4 bg-white sticky top-0 z-50 py-2 border-b">
      {/* Back button */}
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
            </Button>
        <Image src="/LeafMilesLogo.png" alt="Logo" width={30} height={30} />
        <Image src="/LeafMiles.png" alt="Letter" width={80} height={30} />
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Share2 className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <Bookmark className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
