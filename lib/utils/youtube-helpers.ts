import type { YouTubeVideoItem, YouTubeSearchItem } from "@/lib/types/youtube"
import type { Video } from "@/lib/types/video"

// Convert ISO 8601 duration to seconds
export function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = Number.parseInt(match[1] || "0", 10)
  const minutes = Number.parseInt(match[2] || "0", 10)
  const seconds = Number.parseInt(match[3] || "0", 10)

  return hours * 3600 + minutes * 60 + seconds
}

// Convert YouTube API response to our Video type
export function convertYouTubeVideoToVideo(youtubeVideo: YouTubeVideoItem, searchItem?: YouTubeSearchItem): Video {
  const snippet = youtubeVideo.snippet
  const statistics = youtubeVideo.statistics
  const contentDetails = youtubeVideo.contentDetails

  return {
    id: youtubeVideo.id,
    title: snippet.title,
    description: snippet.description,
    thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default.url,
    duration: parseDuration(contentDetails.duration),
    views: Number.parseInt(statistics.viewCount || "0", 10),
    publishedAt: new Date(snippet.publishedAt),
    channel: {
      id: snippet.channelId,
      name: snippet.channelTitle,
      avatar: "", // Will be populated separately if needed
      verified: false, // Will be determined from channel details
    },
    tags: snippet.tags || [],
    videoUrl: `https://www.youtube.com/watch?v=${youtubeVideo.id}`,
  }
}

// Convert search item to basic video info (before getting full details)
export function convertSearchItemToVideo(searchItem: YouTubeSearchItem): Partial<Video> {
  const snippet = searchItem.snippet

  return {
    id: searchItem.id.videoId,
    title: snippet.title,
    description: snippet.description,
    thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url || snippet.thumbnails.default.url,
    publishedAt: new Date(snippet.publishedAt),
    channel: {
      id: snippet.channelId,
      name: snippet.channelTitle,
      avatar: "",
      verified: false,
    },
    tags: [],
    videoUrl: `https://www.youtube.com/watch?v=${searchItem.id.videoId}`,
  }
}

// Extract video ID from YouTube URL
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/user\/[^/]+#p\/[a-z]\/[0-9]+\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

// Generate YouTube embed URL
export function getYouTubeEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean
    controls?: boolean
    start?: number
    end?: number
    loop?: boolean
    mute?: boolean
  } = {},
): string {
  const params = new URLSearchParams()

  if (options.autoplay) params.append("autoplay", "1")
  if (options.controls === false) params.append("controls", "0")
  if (options.start) params.append("start", options.start.toString())
  if (options.end) params.append("end", options.end.toString())
  if (options.loop) params.append("loop", "1")
  if (options.mute) params.append("mute", "1")

  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`
}

// Format view count for display
export function formatViewCount(views: number): string {
  if (views >= 1000000000) {
    return `${(views / 1000000000).toFixed(1)}B`
  } else if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  return views.toLocaleString()
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Validate YouTube API key
export function validateApiKey(apiKey: string): boolean {
  return apiKey && apiKey.length > 0 && apiKey.startsWith("AIza")
}

// Get video quality options
export function getVideoQualityOptions() {
  return [
    { label: "Auto", value: "auto" },
    { label: "1080p", value: "hd1080" },
    { label: "720p", value: "hd720" },
    { label: "480p", value: "large" },
    { label: "360p", value: "medium" },
    { label: "240p", value: "small" },
  ]
}
