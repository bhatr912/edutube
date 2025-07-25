export const YOUTUBE_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "AIzaSyAPev839Wx86NsGMa44ZdX5FYQn25kE1r0",
  BASE_URL: "https://www.googleapis.com/youtube/v3",
  DEFAULT_PARAMS: {
    part: "snippet,statistics,contentDetails",
    maxResults: 25,
    type: "video",
    videoEmbeddable: "true",
    videoSyndicated: "true",
    order: "relevance",
  },
} as const

export const YOUTUBE_ENDPOINTS = {
  SEARCH: "/search",
  VIDEOS: "/videos",
  CHANNELS: "/channels",
  PLAYLISTS: "/playlists",
  COMMENTS: "/commentThreads",
} as const
