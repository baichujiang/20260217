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
        <div
          className="relative inline-flex items-center bg-white rounded-full px-4 pl-12 py-2 transition hover:ring-2 hover:ring-green-300"
          onClick={() => router.push("/badge")} // 外层点击跳转 /badge
        >
          {/* Avatar 可单独点击跳转到 profile，并阻止冒泡 */}
          <div
            onClick={(e) => {
              e.stopPropagation();  // 阻止事件向上冒泡
              router.push("/account/profile");
            }}
            className="absolute left-0 ml-1 w-10 h-10 rounded-full overflow-hidden border-2 border-white cursor-pointer z-10"
          >
            <Avatar className="w-full h-full">
              <AvatarImage src={avatarUrl} alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>

          {/* 点击 badge 区域跳转 /badge */}
          <div className="flex flex-col items-start leading-tight ml-2">
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
