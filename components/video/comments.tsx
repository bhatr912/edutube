"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ThumbsUp, ThumbsDown, MoreVertical, SortDesc } from "lucide-react"
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
      <div className="mt-6">
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
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
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="mt-6">
      {/* Comments Header */}
      <div className="flex items-center space-x-8 mb-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-xl font-semibold text-gray-900">{comments.length.toLocaleString()} Comments</h3>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded-full px-3 py-2"
        >
          <SortDesc className="h-4 w-4" />
          <span className="text-sm font-medium">Sort by</span>
        </Button>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No comments yet</p>
          <p className="text-gray-400 text-sm mt-1">Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white font-semibold text-sm">
                  {comment.author.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-gray-900 truncate">
                    @{comment.author.toLowerCase().replace(/\s+/g, "")}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{comment.timestamp}</span>
                </div>

                <div
                  className="text-sm text-gray-900 leading-relaxed mb-2 break-words"
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />

                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-gray-600 hover:bg-gray-100 rounded-full px-2 py-1 h-8"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-1 text-gray-600 hover:bg-gray-100 rounded-full px-2 py-1 h-8"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-gray-600 hover:bg-gray-100 rounded-full px-2 py-1 h-8 font-medium"
                  >
                    Reply
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:bg-gray-100 rounded-full p-1 h-8 w-8"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </div>

                {comment.replies > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 rounded-full px-3 py-1 mt-2 h-8"
                  >
                    <span className="text-xs font-medium">
                      {comment.replies} {comment.replies === 1 ? "reply" : "replies"}
                    </span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Comments */}
      {comments.length > 0 && (
        <div className="mt-8 text-center">
          <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 rounded-full px-6 py-2">
            Show more comments
          </Button>
        </div>
      )}
    </div>
  )
}

function CommentSkeleton() {
  return (
    <div className="flex space-x-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  )
}
