"use client"

import { useState, useEffect, useCallback } from "react"
import { youtubeAPI, YouTubeAPIError } from "@/lib/services/youtube-api"
import { convertYouTubeVideoToVideo } from "@/lib/utils/youtube-helpers"
import type { Video, Comment } from "@/lib/types/video"
import type { YouTubeCommentItem } from "@/lib/types/youtube"

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

        // Get channel data for each video
        const channelIds = [...new Set(videoDetailsResponse.items.map((item) => item.snippet.channelId))]
        let channelMap = new Map()

        try {
          const channelResponse = await youtubeAPI.getChannelDetails(channelIds)
          channelMap = new Map(channelResponse.items.map((channel) => [channel.id, channel]))
        } catch (channelError) {
          console.warn("Failed to fetch channel data:", channelError)
        }

        // Convert to our Video format
        const newVideos = videoDetailsResponse.items.map((videoItem) =>
          convertYouTubeVideoToVideo(videoItem, channelMap.get(videoItem.snippet.channelId)),
        )

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
  comments: Comment[]
  loadVideo: (videoId: string) => Promise<void>
  loadComments: () => Promise<void>
}

export function useYouTubeVideo(videoId?: string): UseYouTubeVideoResult {
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])
  const [comments, setComments] = useState<Comment[]>([])

  const loadVideo = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      // Load video details
      const videoResponse = await youtubeAPI.getVideoById(id)

      if (videoResponse.items.length === 0) {
        throw new YouTubeAPIError("Video not found")
      }

      const videoItem = videoResponse.items[0]

      // Load channel details
      let channelData = null
      try {
        const channelResponse = await youtubeAPI.getChannelDetails([videoItem.snippet.channelId])
        channelData = channelResponse.items[0] || null
      } catch (channelError) {
        console.warn("Failed to fetch channel data:", channelError)
      }

      const videoData = convertYouTubeVideoToVideo(videoItem, channelData)
      setVideo(videoData)

      // Load related videos
      try {
        const relatedResponse = await youtubeAPI.getRelatedVideos(id, 8)
        const relatedVideoIds = relatedResponse.items.map((item) => item.id.videoId)

        if (relatedVideoIds.length > 0) {
          const relatedDetailsResponse = await youtubeAPI.getVideoDetails(relatedVideoIds)

          // Get channel data for related videos
          const relatedChannelIds = [...new Set(relatedDetailsResponse.items.map((item) => item.snippet.channelId))]
          let relatedChannelMap = new Map()

          try {
            const relatedChannelResponse = await youtubeAPI.getChannelDetails(relatedChannelIds)
            relatedChannelMap = new Map(relatedChannelResponse.items.map((channel) => [channel.id, channel]))
          } catch (channelError) {
            console.warn("Failed to fetch related channel data:", channelError)
          }

          const relatedVideosData = relatedDetailsResponse.items.map((item) =>
            convertYouTubeVideoToVideo(item, relatedChannelMap.get(item.snippet.channelId)),
          )
          setRelatedVideos(relatedVideosData)
        }
      } catch (relatedError) {
        console.warn("Failed to load related videos:", relatedError)
        setRelatedVideos([])
      }

      // Load comments
      try {
        const commentsResponse = await youtubeAPI.getVideoComments(id, {
          maxResults: 20,
        })

        const formattedComments: Comment[] = commentsResponse.items.map((item: YouTubeCommentItem) => ({
          id: item.id,
          author: {
            name: item.snippet.topLevelComment.snippet.authorDisplayName,
            avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
            channelId: item.snippet.topLevelComment.snippet.authorChannelId?.value,
          },
          content: item.snippet.topLevelComment.snippet.textDisplay,
          likes: item.snippet.topLevelComment.snippet.likeCount,
          publishedAt: new Date(item.snippet.topLevelComment.snippet.publishedAt),
          replyCount: item.snippet.totalReplyCount,
          replies:
            item.replies?.comments?.map((reply) => ({
              id: reply.id,
              author: {
                name: reply.snippet.authorDisplayName,
                avatar: reply.snippet.authorProfileImageUrl,
                channelId: reply.snippet.authorChannelId?.value,
              },
              content: reply.snippet.textDisplay,
              likes: reply.snippet.likeCount,
              publishedAt: new Date(reply.snippet.publishedAt),
            })) || [],
        }))

        setComments(formattedComments)
      } catch (commentsError) {
        console.warn("Failed to load comments:", commentsError)
        setComments([])
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

      const formattedComments: Comment[] = commentsResponse.items.map((item: YouTubeCommentItem) => ({
        id: item.id,
        author: {
          name: item.snippet.topLevelComment.snippet.authorDisplayName,
          avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
          channelId: item.snippet.topLevelComment.snippet.authorChannelId?.value,
        },
        content: item.snippet.topLevelComment.snippet.textDisplay,
        likes: item.snippet.topLevelComment.snippet.likeCount,
        publishedAt: new Date(item.snippet.topLevelComment.snippet.publishedAt),
        replyCount: item.snippet.totalReplyCount,
        replies:
          item.replies?.comments?.map((reply) => ({
            id: reply.id,
            author: {
              name: reply.snippet.authorDisplayName,
              avatar: reply.snippet.authorProfileImageUrl,
              channelId: reply.snippet.authorChannelId?.value,
            },
            content: reply.snippet.textDisplay,
            likes: reply.snippet.likeCount,
            publishedAt: new Date(reply.snippet.publishedAt),
          })) || [],
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
      // Try to get popular videos first
      let videoResponse
      try {
        videoResponse = await youtubeAPI.getPopularVideos({ maxResults: 20 })
      } catch (popularError) {
        console.warn("Popular videos not available, falling back to educational content:", popularError)
        // Fallback to educational videos
        const searchResponse = await youtubeAPI.getEducationalVideos({ maxResults: 20 })
        const videoIds = searchResponse.items.map((item) => item.id.videoId)
        videoResponse = await youtubeAPI.getVideoDetails(videoIds)
      }

      if (videoResponse.items.length === 0) {
        setVideos([])
        return
      }

      // Get channel data for each video
      const channelIds = [...new Set(videoResponse.items.map((item) => item.snippet.channelId))]
      let channelMap = new Map()

      try {
        const channelResponse = await youtubeAPI.getChannelDetails(channelIds)
        channelMap = new Map(channelResponse.items.map((channel) => [channel.id, channel]))
      } catch (channelError) {
        console.warn("Failed to fetch channel data:", channelError)
      }

      const videosData = videoResponse.items.map((item) =>
        convertYouTubeVideoToVideo(item, channelMap.get(item.snippet.channelId)),
      )

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
