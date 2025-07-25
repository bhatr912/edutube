"use client"

import { useState, useEffect, useCallback } from "react"
import { youtubeAPI, YouTubeAPIError } from "@/lib/services/youtube-api"
import { convertYouTubeVideoToVideo } from "@/lib/utils/youtube-helpers"
import type { Video } from "@/lib/types/video"

interface UseYouTubeSearchResult {
  videos: Video[]
  loading: boolean
  error: string | null
  hasMore: boolean
  nextPageToken: string | null
  searchVideos: (query: string, reset?: boolean) => Promise<void>
  loadMore: () => Promise<void>
}

export function useYouTubeSearch(initialQuery = ""): UseYouTubeSearchResult {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nextPageToken, setNextPageToken] = useState<string | null>(null)
  const [currentQuery, setCurrentQuery] = useState(initialQuery)
  const [hasMore, setHasMore] = useState(true)

  const searchVideos = useCallback(
    async (query: string, reset = true) => {
      if (!query.trim()) return

      setLoading(true)
      setError(null)

      if (reset) {
        setVideos([])
        setNextPageToken(null)
        setHasMore(true)
      }

      try {
        const searchResponse = await youtubeAPI.searchVideos(query, {
          maxResults: 12,
          pageToken: reset ? undefined : nextPageToken || undefined,
        })

        if (searchResponse.items.length === 0) {
          setHasMore(false)
          if (reset) setVideos([])
          return
        }

        // Get detailed video information
        const videoIds = searchResponse.items.map((item) => item.id.videoId)
        const videoDetailsResponse = await youtubeAPI.getVideoDetails(videoIds)

        // Convert to our Video format
        const newVideos = videoDetailsResponse.items.map((videoItem) => convertYouTubeVideoToVideo(videoItem))

        setVideos((prev) => (reset ? newVideos : [...prev, ...newVideos]))
        setNextPageToken(searchResponse.nextPageToken || null)
        setHasMore(!!searchResponse.nextPageToken)
        setCurrentQuery(query)
      } catch (err) {
        const errorMessage = err instanceof YouTubeAPIError ? err.message : "Failed to search videos"
        setError(errorMessage)
        console.error("YouTube search error:", err)
      } finally {
        setLoading(false)
      }
    },
    [nextPageToken],
  )

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !currentQuery) return
    await searchVideos(currentQuery, false)
  }, [hasMore, loading, currentQuery, searchVideos])

  // Initial search
  useEffect(() => {
    if (initialQuery) {
      searchVideos(initialQuery)
    }
  }, []) // Only run once on mount

  return {
    videos,
    loading,
    error,
    hasMore,
    nextPageToken,
    searchVideos,
    loadMore,
  }
}

interface UseYouTubeVideoResult {
  video: Video | null
  loading: boolean
  error: string | null
  relatedVideos: Video[]
  comments: any[]
  loadVideo: (videoId: string) => Promise<void>
  loadComments: () => Promise<void>
}

export function useYouTubeVideo(videoId?: string): UseYouTubeVideoResult {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [comments, setComments] = useState<any[]>([])

  const loadVideo = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      // Load video details
      const videoResponse = await youtubeAPI.getVideoById(id)

      if (videoResponse.items.length === 0) {
        throw new YouTubeAPIError("Video not found")
      }

      const videoData = convertYouTubeVideoToVideo(videoResponse.items[0])
      setVideo(videoData)

      // Load related videos
      try {
        const relatedResponse = await youtubeAPI.getRelatedVideos(id, 8)
        const relatedVideoIds = relatedResponse.items.map((item) => item.id.videoId)

        if (relatedVideoIds.length > 0) {
          const relatedDetailsResponse = await youtubeAPI.getVideoDetails(relatedVideoIds)
          const relatedVideosData = relatedDetailsResponse.items.map((item) => convertYouTubeVideoToVideo(item))
          setRelatedVideos(relatedVideosData)
        }
      } catch (relatedError) {
        console.warn("Failed to load related videos:", relatedError)
        setRelatedVideos([])
      }
    } catch (err) {
      const errorMessage = err instanceof YouTubeAPIError ? err.message : "Failed to load video"
      setError(errorMessage)
      console.error("YouTube video load error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadComments = useCallback(async () => {
    if (!video) return

    try {
      const commentsResponse = await youtubeAPI.getVideoComments(video.id, {
        maxResults: 20,
      })

      const formattedComments = commentsResponse.items.map((item) => ({
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
      console.warn("Failed to load comments:", err)
      setComments([])
    }
  }, [video])

  // Load video when videoId changes
  useEffect(() => {
    if (videoId) {
      loadVideo(videoId)
    }
  }, [videoId, loadVideo])

  return {
    video,
    loading,
    error,
    relatedVideos,
    comments,
    loadVideo,
    loadComments,
  }
}

interface UsePopularVideosResult {
  videos: Video[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function usePopularVideos(): UsePopularVideosResult {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPopularVideos = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const searchResponse = await youtubeAPI.getEducationalVideos({
        maxResults: 20,
      })

      if (searchResponse.items.length === 0) {
        setVideos([])
        return
      }

      const videoIds = searchResponse.items.map((item) => item.id.videoId)
      const videoDetailsResponse = await youtubeAPI.getVideoDetails(videoIds)

      const videosData = videoDetailsResponse.items.map((item) => convertYouTubeVideoToVideo(item))

      setVideos(videosData)
    } catch (err) {
      const errorMessage = err instanceof YouTubeAPIError ? err.message : "Failed to load popular videos"
      setError(errorMessage)
      console.error("Popular videos load error:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    await loadPopularVideos()
  }, [loadPopularVideos])

  useEffect(() => {
    loadPopularVideos()
  }, [loadPopularVideos])

  return {
    videos,
    loading,
    error,
    refresh,
  }
}
