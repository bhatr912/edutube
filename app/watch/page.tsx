"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { VideoPlayer } from "@/components/video/video-player"
import { VideoInfo } from "@/components/video/video-info"
import { Comments } from "@/components/video/comments"
import { RelatedVideos } from "@/components/video/related-videos"
import { NavigationRail } from "@/components/layout/navigation-rail"
import { WatchHeader } from "@/components/layout/watch-header"
import { ChatMode } from "@/components/video/chat-mode"
import { NoteMode } from "@/components/video/note-mode"
import { AIHighlights } from "@/components/video/ai-highlights"
import { useYouTubeVideo } from "@/lib/hooks/use-youtube-data"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

function WatchPageContent() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get("v")

  const { video, loading, error, relatedVideos } = useYouTubeVideo(videoId || undefined)

  const [currentMode, setCurrentMode] = useState<"video" | "chat" | "notes">("video")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isNavCollapsed, setIsNavCollapsed] = useState(true)

  if (!videoId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No video ID provided. Please select a video to watch.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavigationRail
          currentMode={currentMode}
          onModeChange={setCurrentMode}
          isCollapsed={isNavCollapsed}
          onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
        />

        <div className={cn("transition-all duration-300 ease-in-out", isNavCollapsed ? "ml-16" : "ml-64")}>
          <WatchHeader />
          <div className="flex gap-6 p-6">
            <div className="flex-1 space-y-6">
              <Skeleton className="w-full aspect-video rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="w-96">
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="w-40 h-24 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Video not found"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <NavigationRail
        currentMode={currentMode}
        onModeChange={setCurrentMode}
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)}
      />

      <div className={cn("transition-all duration-300 ease-in-out", isNavCollapsed ? "ml-16" : "ml-64")}>
        {/* Header */}
        <WatchHeader />

        <div className="flex gap-6 p-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <VideoPlayer
              video={video}
              isFullscreen={isFullscreen}
              onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
            />

            {!isFullscreen && (
              <>
                <VideoInfo video={video} />
                <Comments videoId={video.id} />
              </>
            )}
          </div>

          {/* Mode-specific Content */}
          {currentMode === "chat" && !isFullscreen && (
            <div className="w-96">
              <ChatMode video={video} />
            </div>
          )}

          {currentMode === "notes" && !isFullscreen && (
            <div className="w-96">
              <NoteMode video={video} />
            </div>
          )}

          {/* Right Sidebar */}
          {currentMode === "video" && !isFullscreen && (
            <div className="w-96 transition-all duration-300 ease-in-out">
              <div className="space-y-6 sticky top-6">
                <AIHighlights />
                <RelatedVideos currentVideoId={video.id} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video...</p>
          </div>
        </div>
      }
    >
      <WatchPageContent />
    </Suspense>
  )
}
