"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { formatViewCount, formatDuration } from "@/lib/utils/youtube-helpers"
import { formatDistanceToNow } from "date-fns"
import { youtubeAPI } from "@/lib/services/youtube-api"
import { convertYouTubeVideoToVideo } from "@/lib/utils/youtube-helpers"
import { Skeleton } from "@/components/ui/skeleton"
import type { Video } from "@/lib/types/video"

interface RelatedVideosProps {
  currentVideoId?: string
}

export function RelatedVideos({ currentVideoId }: RelatedVideosProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadRelatedVideos() {
      if (!currentVideoId) {
        // Load popular educational videos as fallback
        try {
          const response = await youtubeAPI.getEducationalVideos({ maxResults: 8 })
          const videoIds = response.items.map((item) => item.id.videoId)
          const detailsResponse = await youtubeAPI.getVideoDetails(videoIds)
          const videosData = detailsResponse.items.map((item) => convertYouTubeVideoToVideo(item))
          setVideos(videosData.slice(0, 6))
        } catch (err) {
          setError("Failed to load videos")
        } finally {
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await youtubeAPI.getRelatedVideos(currentVideoId, 8)
        const videoIds = response.items
          .filter((item) => item.id.videoId !== currentVideoId) // Exclude current video
          .map((item) => item.id.videoId)
          .slice(0, 6)

        if (videoIds.length > 0) {
          const detailsResponse = await youtubeAPI.getVideoDetails(videoIds)
          const videosData = detailsResponse.items.map((item) => convertYouTubeVideoToVideo(item))
          setVideos(videosData)
        } else {
          setVideos([])
        }
      } catch (err) {
        setError("Failed to load related videos")
        console.error("Related videos error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadRelatedVideos()
  }, [currentVideoId])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Up Next</h3>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <RelatedVideoSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error || videos.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Up Next</h3>
        <p className="text-sm text-gray-500">{error || "No related videos found"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Up Next</h3>

      <div className="space-y-3">
        {videos.map((video) => (
          <Link key={video.id} href={`/watch?v=${video.id}`}>
            <div className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="relative w-40 h-24 flex-shrink-0">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover rounded"
                  sizes="160px"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                  {formatDuration(video.duration)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{video.title}</h4>
                <p className="text-xs text-gray-600 mb-1">{video.channel.name}</p>
                <div className="text-xs text-gray-500">
                  {formatViewCount(video.views)} views • {formatDistanceToNow(video.publishedAt, { addSuffix: true })}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function RelatedVideoSkeleton() {
  return (
    <div className="flex gap-3 p-2">
      <Skeleton className="w-40 h-24 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
