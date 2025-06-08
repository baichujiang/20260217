"use client"

import Image from "next/image"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export interface User {
  id: string
  name: string
  avatar: string
  score: number
}

export interface LeaderboardProps {
  users: User[]
}

export function Leaderboard({ users = [] }: LeaderboardProps) {
  return (
    <div className="mt-8 bg-yellow-50 p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-yellow-900 mb-3">Leaderboard</h2>
      <Tabs defaultValue="Daily" className="w-full">
        <TabsList className="bg-yellow-100 rounded-full p-1 mb-3">
          <TabsTrigger value="Daily" className="data-[state=active]:bg-white data-[state=active]:text-yellow-900 px-4 py-1 rounded-full text-sm">Daily</TabsTrigger>
          <TabsTrigger value="Week" className="data-[state=active]:bg-white data-[state=active]:text-yellow-900 px-4 py-1 rounded-full text-sm">Week</TabsTrigger>
          <TabsTrigger value="Total" className="data-[state=active]:bg-white data-[state=active]:text-yellow-900 px-4 py-1 rounded-full text-sm">Total</TabsTrigger>
        </TabsList>

        {(["Daily", "Week", "Total"] as const).map((period) => (
          <TabsContent key={period} value={period} className="p-0">
            <ul className="space-y-2">
              {users.map((u, idx) => (
                <li key={u.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-bold w-5 text-yellow-600 ${idx < 3 ? 'text-lg' : ''}`}>{idx + 1}</span>
                    <Image
                      src={u.avatar}
                      alt={u.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900 truncate max-w-[100px]">{u.name}</span>
                  </div>
                  <span className="text-green-600 font-bold text-sm">{u.score} pts</span>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
