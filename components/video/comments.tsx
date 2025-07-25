"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, MessageCircle, ChevronDown } from "lucide-react"
import { formatCompactNumber, formatRelativeTime } from "@/lib/utils/format"
import type { Comment } from "@/lib/types/video"
import { Skeleton } from "@/components/ui/skeleton"

interface CommentsProps {
  comments: Comment[]
  isLoading: boolean
}

export function Comments({ comments, isLoading }: CommentsProps) {
  const [sortOrder, setSortOrder] = useState("top") // 'top' or 'newest'

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "top") {
      return b.likeCount - a.likeCount
    } else {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{formatCompactNumber(comments.length)} Comments</h2>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="flex items-center gap-1 text-sm">
            <ChevronDown className="w-4 h-4" />
            Sort by
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedComments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.authorThumbnailUrl || "/placeholder-user.jpg"} alt={comment.authorName} />
                <AvatarFallback>{comment.authorName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{comment.authorName}</span>
                  <span className="text-gray-500 dark:text-gray-400">{formatRelativeTime(comment.publishedAt)}</span>
                </div>
                <p className="text-sm">{comment.text}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <Button variant="ghost" className="flex items-center gap-1 p-0 h-auto">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{formatCompactNumber(comment.likeCount)}</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-1 p-0 h-auto">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                  {comment.replyCount > 0 && (
                    <Button variant="ghost" className="flex items-center gap-1 p-0 h-auto">
                      <MessageCircle className="w-4 h-4" />
                      <span>{comment.replyCount} replies</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
