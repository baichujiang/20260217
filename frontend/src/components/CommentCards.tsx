'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Toggle } from '@/components/ui/toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Comment } from '@/types/review';
import { TopTag } from '@/types/restaurant';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { DialogDescription } from '@radix-ui/react-dialog';

interface CommentCardsProps {
  tags: TopTag[];
  comments: Comment[];
}

export default function CommentCards({ comments, tags }: CommentCardsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

            <CardContent className="space-y-4">
              <p>{comment.comment}</p>

              {/* Images */}
              {comment.images.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
                  {comment.images.map((img, idx) => (
                    <Dialog key={img.id}>
                      <DialogTrigger asChild>
                        <div
                          className="relative w-22 aspect-square rounded-lg overflow-hidden border cursor-pointer"
                          onClick={() => setSelectedImage(img.url)}
                        >
                          <Image
                            src={img.url}
                            alt={`Review image ${img.id}`}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                            className="object-cover"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl p-0 bg-transparent border-none shadow-none">
                        <DialogTitle />
                        <DialogDescription />
                        {selectedImage && (
                          <div className="relative w-full h-[80vh]">
                            <Image
                              src={selectedImage}
                              alt="Full review image"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
