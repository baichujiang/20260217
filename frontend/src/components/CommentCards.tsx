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
import {Comment} from "@/types/review"


interface CommentCardsProps {
  comments: Comment[];
}

export default function CommentCards({ comments }:CommentCardsProps) {

  return (
    <main>
      <div className="flex flex-wrap gap-2 w-screen px-6">
        <Toggle variant="outline" className='rounded-3xl'>Local Supplier</Toggle>
        <Toggle variant="outline" className='rounded-3xl'>Seasonal Menu</Toggle>
        <Toggle variant="outline" className='rounded-3xl'>Vegan</Toggle>
        <Toggle variant="outline" className='rounded-3xl'>Reusable Takeaway Box</Toggle>
      </div>
      <div className="flex flex-col divide-y divide-gray-200">
        {comments.map(comment => (
          <Card key={comment.review_id} className='w-screen flex flex-col justify-between border-none shadow-none'>
            <CardHeader className="flex flex-row gap-4 items-center">
              <Avatar>
                <AvatarImage src="/avatar-default.svg" alt="default-avatar" />
                <AvatarFallback>{comment.user_name.slice(0, 2)}</AvatarFallback>
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
