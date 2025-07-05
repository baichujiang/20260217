"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Toggle } from "@/components/ui/toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Comment } from "@/types/review"
import { TopTag } from "@/types/restaurant"


interface CommentCardsProps {
  tags: TopTag[];
  comments: Comment[];
}

export default function CommentCards({ comments, tags }: CommentCardsProps) {
  return (
    <main>
      {/* Tag toggles */}
      <div className="flex flex-wrap gap-2 w-screen px-6 py-4">
        {tags.map((tag) => (
          <Toggle
            key={tag.name}
            variant="outline"
            className="rounded-3xl text-sm"
          >
            {tag.name}
          </Toggle>
        ))}
      </div>

      {/* Review cards */}
      <div className="flex flex-col divide-y divide-gray-200">
        {comments.map((comment) => (
          <Card
            key={comment.review_id}
            className="w-screen flex flex-col justify-between border-none shadow-none"
          >
            <CardHeader className="flex flex-row gap-4 items-center">
              <Avatar>
                <AvatarImage src="/avatar-default.svg" alt="default-avatar" />
                <AvatarFallback>
                  {comment.user_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{comment.user_name}</CardTitle>
                <CardDescription>{comment.created_at}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{comment.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}