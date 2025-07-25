"use client"

import { usePopularVideos } from "@/lib/hooks/use-youtube-data"
import { VideoCard } from "./video-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle } from "lucide-react"

export function VideoList() {
  const { videos, loading, error, refresh } = usePopularVideos()

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <VideoCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load videos: {error}</span>
          <Button variant="outline" size="sm" onClick={refresh} className="ml-4 bg-transparent">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No videos found</p>
        <Button onClick={refresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

function VideoCardSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-lg">
      <Skeleton className="w-80 h-48 rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="flex gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
