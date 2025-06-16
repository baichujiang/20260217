import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Toggle } from "@/components/ui/toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: string,
  userName: string,
  date: string,
  content: string
}

async function getComments(): Promise<Comment[]> {
  const result = await fetch('http://localhost:4000/comments')
  return result.json()
}

export default async function CommentCards() {
  const comments = await getComments()

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
          <Card key={comment.id} className='w-screen flex felx-col justify-between border-none shadow-none'>
            <CardHeader className="flex flex-row gap-4 items-center">
              <Avatar>
                <AvatarImage src="/avatar-default.svg" alt="default-avatar"/>
                <AvatarFallback>{comment.userName.slice(0,2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{comment.userName}</CardTitle>
                <CardDescription>{comment.date}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p>{comment.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}