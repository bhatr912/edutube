"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react"
import { youtubeAPI } from "@/lib/services/youtube-api"

interface CommentsProps {
  videoId: string
}

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  likes: number
  timestamp: string
  replies: number
}

export function Comments({ videoId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadComments() {
      if (!videoId) return

      setLoading(true)
      setError(null)

      try {
        const response = await youtubeAPI.getVideoComments(videoId, {
          maxResults: 20,
        })

        const formattedComments = response.items.map((item) => ({
          id: item.id,
          author: item.snippet.topLevelComment.snippet.authorDisplayName,
          avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          content: item.snippet.topLevelComment.snippet.textDisplay,
          likes: item.snippet.topLevelComment.snippet.likeCount,
          timestamp: new Date(item.snippet.topLevelComment.snippet.publishedAt).toLocaleDateString(),
          replies: item.snippet.totalReplyCount,
        }))

        setComments(formattedComments)
      } catch (err) {
        setError("Failed to load comments")
        console.error("Comments error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadComments()
  }, [videoId])

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
          <Separator />
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <CommentSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Comments Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
              {comments.length}
            </span>
          </div>
          <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 bg-transparent">
            Sort by
          </Button>
        </div>

        <Separator />

        {/* Add Comment */}
        <div className="flex space-x-4">
          <Avatar className="w-10 h-10 ring-2 ring-gray-100">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Add a comment..."
              className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>💭 Be respectful and constructive</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Cancel
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet</p>
        ) : (
          <div className="space-y-6">
            {comments.map((comment, index) => (
              <div key={comment.id} className="space-y-4">
                <div className="flex space-x-4">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                    <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white font-semibold">
                      {comment.author.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.timestamp}</span>
                    </div>

                    <div
                      className="text-sm text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                          Reply
                        </Button>
                        {comment.replies > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          >
                            View {comment.replies} {comment.replies === 1 ? "reply" : "replies"}
                          </Button>
                        )}
                      </div>

                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {index < comments.length - 1 && <Separator className="ml-14" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CommentSkeleton() {
  return (
    <div className="flex space-x-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    </div>
  )
}
