"use client"

import { useState } from "react"
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal, Bell, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatViewCount, formatPublishedDate, processDescription } from "@/lib/utils/youtube-helpers"
import type { Video } from "@/lib/types/video"

interface VideoInfoProps {
  video: Video
}

export function VideoInfo({ video }: VideoInfoProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  const toggleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
  }

  // Truncate description for collapsed state
  const truncatedDescription =
    video.description.length > 200 ? video.description.substring(0, 200) + "..." : video.description

  return (
    <div className="space-y-4">
      {/* Title */}
      <h1 className="text-xl font-semibold text-gray-900 leading-tight pr-6">{video.title}</h1>

      {/* Video Stats and Actions */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span className="font-medium">{formatViewCount(video.views)} views</span>
          <span>•</span>
          <span>{formatPublishedDate(video.publishedAt.toISOString())}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`rounded-l-full px-4 py-2 ${isLiked ? "bg-blue-100 text-blue-600" : "hover:bg-gray-200"}`}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">{formatViewCount(video.likes)}</span>
            </Button>
            <div className="w-px h-6 bg-gray-300" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDislike}
              className={`rounded-r-full px-4 py-2 ${isDisliked ? "bg-red-100 text-red-600" : "hover:bg-gray-200"}`}
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full px-4 py-2"
          >
            <Share className="h-4 w-4" />
            <span className="text-sm">Share</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-full px-4 py-2"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Download</span>
          </Button>

          <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-full p-2">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Channel Info */}
      <div className="flex items-start justify-between py-4">
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={video.channel.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {video.channel.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900 text-sm">{video.channel.name}</h3>
              {video.channel.verified && (
                <div className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-600">{video.channel.subscribers}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
          <Button
            onClick={toggleSubscribe}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              isSubscribed ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
        </div>
      </div>

      {/* Description Box - YouTube Style */}
      <div className="bg-gray-100 rounded-xl p-3 cursor-pointer hover:bg-gray-200 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-900 mb-2">
              <span>{formatViewCount(video.views)} views</span>
              <span>{formatPublishedDate(video.publishedAt.toISOString())}</span>
              {video.tags && video.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {video.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-blue-600 text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-sm text-gray-700 leading-relaxed">
              {isDescriptionExpanded ? (
                <div
                  className="whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: processDescription(video.description) }}
                />
              ) : (
                <div>
                  <div dangerouslySetInnerHTML={{ __html: processDescription(truncatedDescription) }} />
                  {video.description.length > 200 && (
                    <button onClick={toggleDescription} className="text-gray-900 font-medium ml-1 hover:underline">
                      ...more
                    </button>
                  )}
                </div>
              )}
            </div>

            {isDescriptionExpanded && video.description.length > 200 && (
              <button
                onClick={toggleDescription}
                className="flex items-center space-x-1 text-sm font-medium text-gray-900 mt-2 hover:underline"
              >
                <span>Show less</span>
                <ChevronUp className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
