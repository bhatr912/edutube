// YouTube API Configuration
export const YOUTUBE_CONFIG = {
  BASE_URL: "https://www.googleapis.com/youtube/v3",
  API_KEY: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || "YOUR_API_KEY_HERE",
  DEFAULT_PARAMS: {
    maxResults: 25,
    order: "relevance" as const,
    type: "video" as const,
    videoEmbeddable: "true",
    videoSyndicated: "true",
  },
}

export const YOUTUBE_ENDPOINTS = {
  SEARCH: "/search",
  VIDEOS: "/videos",
  CHANNELS: "/channels",
  COMMENTS: "/commentThreads",
  PLAYLISTS: "/playlists",
  PLAYLIST_ITEMS: "/playlistItems",
}
