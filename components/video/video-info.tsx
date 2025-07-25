"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatCompactNumber, formatRelativeTime } from "@/lib/utils/format"
import type { Video } from "@/lib/types/video"
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal } from "lucide-react"

interface VideoInfoProps {
  video: Video
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription)
  }

  const toggleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  const descriptionLines = video.description.split("\n")
  const displayDescription = showFullDescription
    ? video.description
    : descriptionLines.slice(0, 3).join("\n") + (descriptionLines.length > 3 ? "..." : "")

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={video.channelThumbnailUrl || "/placeholder-user.jpg"} alt={video.channelName} />
            <AvatarFallback>{video.channelName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{video.channelName}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatCompactNumber(video.subscriberCount)} subscribers
            </span>
          </div>
          <Button
            variant={isSubscribed ? "secondary" : "default"}
            className="rounded-full px-4 py-2 text-sm font-medium ml-4"
            onClick={toggleSubscribe}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" className="flex items-center gap-1 rounded-full px-3 py-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{formatCompactNumber(video.likeCount)}</span>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="ghost" className="flex items-center gap-1 rounded-full px-3 py-2">
            <ThumbsDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" className="flex items-center gap-1 rounded-full px-3 py-2">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-1 rounded-full px-3 py-2">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-1 rounded-full px-3 py-2">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm cursor-pointer",
          !showFullDescription && "line-clamp-3",
        )}
        onClick={toggleDescription}
      >
        <div className="font-semibold mb-1">
          {formatCompactNumber(video.viewCount)} views • {formatRelativeTime(video.publishedAt)}
        </div>
        <p className="whitespace-pre-wrap">{displayDescription}</p>
        {descriptionLines.length > 3 && (
          <Button variant="link" className="p-0 h-auto text-sm font-semibold mt-1">
            {showFullDescription ? "Show less" : "Show more"}
          </Button>
        )}
      </div>
    </div>
  )
}
