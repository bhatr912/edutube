"use client"

import { VideoCard } from "@/components/video/video-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Video } from "@/lib/types/video"

interface RelatedVideosProps {
  currentVideoId: string
  videos?: Video[]
  loading?: boolean
}

export function RelatedVideos({ currentVideoId, videos = [], loading = false }: RelatedVideosProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Related Videos</h3>
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="w-40 h-24 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Filter out the current video from related videos
  const filteredVideos = videos.filter((video) => video.id !== currentVideoId)

  if (filteredVideos.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Related Videos</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No related videos found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Related Videos</h3>
      <div className="space-y-4">
        {filteredVideos.map((video) => (
          <div key={video.id} className="flex gap-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
            <div className="w-40 h-24 flex-shrink-0">
              <VideoCard video={video} compact />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight mb-1">{video.title}</h4>
              <p className="text-xs text-gray-600 mb-1">{video.channel.name}</p>
              <div className="flex items-center text-xs text-gray-500 space-x-1">
                <span>{video.views.toLocaleString()} views</span>
                <span>•</span>
                <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
