"use client"

import { Suspense, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { VideoCard } from "@/components/video/video-card"
import { useYouTubeSearch } from "@/lib/hooks/use-youtube-data"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const { videos, loading, error, hasMore, searchVideos, loadMore } = useYouTubeSearch()

  useEffect(() => {
    if (query) {
      searchVideos(query, true)
    }
  }, [query, searchVideos])

  if (!query) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-gray-500">Enter a search query to find videos</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search results for "{query}"</h1>
          {!loading && videos.length > 0 && (
            <p className="text-gray-600">
              Found {videos.length} video{videos.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading && videos.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <SearchResultSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <Alert className="max-w-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to search videos: {error}</AlertDescription>
          </Alert>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No videos found for "{query}"</p>
            <p className="text-sm text-gray-400">Try different keywords or check your spelling</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <Button onClick={loadMore} disabled={loading} variant="outline" className="min-w-32 bg-transparent">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function SearchResultSkeleton() {
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white">
          <Header />
          <main className="container mx-auto px-4 py-6">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading search results...</p>
            </div>
          </main>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
