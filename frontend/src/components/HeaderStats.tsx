"use client"

import { useRouter } from "next/navigation"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function HeaderStats({
  badges,
  greenPoints,
  avatarUrl = "/avatar-default.svg",
}: {
  badges: number
  greenPoints: number
  avatarUrl: string
}) {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center mb-6 px-4">
      {/* Badge pill with overlapping avatar */}
      <div
        onClick={() => router.push("/badge")}
        className="relative inline-flex items-center bg-white rounded-full px-4 pl-12 py-2 cursor-pointer hover:ring-2 hover:ring-green-300 transition"
      >
        <Avatar className="absolute left-0 ml-1 w-10 h-10 border-2 border-white">
          <AvatarImage src={avatarUrl} alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs text-gray-600">Badges</span>
          <span className="text-green-700 font-bold text-sm">{badges}</span>
        </div>
      </div>

      {/* Green Points pill */}
      <div
        onClick={() => router.push("/moretrees")}
        className="inline-flex items-center bg-white rounded-full px-4 py-2 cursor-pointer hover:ring-2 hover:ring-green-300 transition"
      >
        <div className="flex flex-col items-start leading-tight">
          <span className="text-xs text-gray-600">Green Points</span>
          <span className="text-green-700 font-bold text-sm">{greenPoints}</span>
        </div>
      </div>
    </div>
  )
}
