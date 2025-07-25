"use client"

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatViewCount, formatDuration, formatPublishedDate } from "@/lib/utils/youtube-helpers"
import type { Video } from "@/lib/types/video"

interface VideoCardProps {
  video: Video
  compact?: boolean
}

export function VideoCard({ video, compact = false }: VideoCardProps) {
  if (compact) {
    return (
      <Link href={`/watch?v=${video.id}`} className="block">
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group cursor-pointer">
      <Link href={`/watch?v=${video.id}`}>
        <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3">
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>

        <div className="flex gap-3">
          <Avatar className="w-9 h-9 flex-shrink-0">
            <AvatarImage src={video.channel.avatar || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {video.channel.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight mb-1 group-hover:text-blue-600 transition-colors">
              {video.title}
            </h3>

            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center">
                <span className="truncate">{video.channel.name}</span>
                {video.channel.verified && (
                  <div className="w-3 h-3 bg-gray-600 rounded-full flex items-center justify-center ml-1">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <span>{formatViewCount(video.views)} views</span>
                <span>•</span>
                <span>{formatPublishedDate(video.publishedAt.toISOString())}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
