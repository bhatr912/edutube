import type { YouTubeVideoItem, YouTubeChannelItem } from "@/lib/types/youtube"
import type { Video } from "@/lib/types/video"

/**
 * Convert ISO 8601 duration to seconds
 * Example: PT4M13S -> 253 seconds
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = Number.parseInt(match[1] || "0", 10)
  const minutes = Number.parseInt(match[2] || "0", 10)
  const seconds = Number.parseInt(match[3] || "0", 10)

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Format duration in seconds to readable format
 * Example: 253 -> "4:13"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

/**
 * Format view count to readable format
 * Example: 1234567 -> "1.2M views"
 */
export function formatViewCount(count: number): string {
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B`
  }
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

/**
 * Format subscriber count to readable format
 */
export function formatSubscriberCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M subscribers`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K subscribers`
  }
  return `${count} subscribers`
}

/**
 * Format published date to relative time
 */
export function formatPublishedDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? "s" : ""} ago`
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? "s" : ""} ago`
  }
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years} year${years > 1 ? "s" : ""} ago`
}

/**
 * Process description text to make URLs clickable and handle timestamps
 */
export function processDescription(description: string): string {
  if (!description) return ""

  // Make URLs clickable
  const urlRegex = /(https?:\/\/[^\s]+)/g
  let processed = description.replace(
    urlRegex,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>',
  )

  // Make timestamps clickable (e.g., 1:23, 12:34, 1:23:45)
  const timestampRegex = /(\d{1,2}:)?(\d{1,2}):(\d{2})/g
  processed = processed.replace(
    timestampRegex,
    '<span class="text-blue-600 cursor-pointer hover:underline" onclick="seekToTime(\'$&\')">$&</span>',
  )

  return processed
}

/**
 * Create YouTube embed URL with custom parameters
 */
export function createYouTubeEmbedUrl(
  videoId: string,
  options: {
    autoplay?: boolean
    mute?: boolean
    controls?: boolean
    modestbranding?: boolean
    rel?: boolean
    showinfo?: boolean
    start?: number
    end?: number
  } = {},
): string {
  const params = new URLSearchParams()

  if (options.autoplay) params.set("autoplay", "1")
  if (options.mute) params.set("mute", "1")
  if (options.controls === false) params.set("controls", "0")
  if (options.modestbranding) params.set("modestbranding", "1")
  if (options.rel === false) params.set("rel", "0")
  if (options.showinfo === false) params.set("showinfo", "0")
  if (options.start) params.set("start", options.start.toString())
  if (options.end) params.set("end", options.end.toString())

  const queryString = params.toString()
  return `https://www.youtube.com/embed/${videoId}${queryString ? `?${queryString}` : ""}`
}

/**
 * Get YouTube embed URL (alias for backward compatibility)
 */
export const getYouTubeEmbedUrl = createYouTubeEmbedUrl

/**
 * Convert YouTube API video data to our Video interface
 */
export function convertYouTubeVideoToVideo(
  youtubeVideo: YouTubeVideoItem,
  channelData?: YouTubeChannelItem | null,
): Video {
  const duration = parseDuration(youtubeVideo.contentDetails.duration)
  const views = Number.parseInt(youtubeVideo.statistics.viewCount || "0", 10)
  const likes = Number.parseInt(youtubeVideo.statistics.likeCount || "0", 10)
  const comments = Number.parseInt(youtubeVideo.statistics.commentCount || "0", 10)

  return {
    id: youtubeVideo.id,
    title: youtubeVideo.snippet.title,
    description: youtubeVideo.snippet.description || "",
    thumbnail:
      youtubeVideo.snippet.thumbnails.high?.url ||
      youtubeVideo.snippet.thumbnails.medium?.url ||
      youtubeVideo.snippet.thumbnails.default.url,
    duration,
    views,
    likes,
    comments,
    publishedAt: new Date(youtubeVideo.snippet.publishedAt),
    channelId: youtubeVideo.snippet.channelId,
    channelName: youtubeVideo.snippet.channelTitle,
    channelThumbnailUrl: channelData?.snippet.thumbnails.default?.url || "/placeholder.svg",
    subscriberCount: channelData ? Number.parseInt(channelData.statistics.subscriberCount || "0", 10) : 0,
    tags: youtubeVideo.snippet.tags || [],
    category: youtubeVideo.snippet.categoryId,
    url: `https://www.youtube.com/watch?v=${youtubeVideo.id}`,
    embedUrl: createYouTubeEmbedUrl(youtubeVideo.id, {
      modestbranding: true,
      rel: false,
      showinfo: false,
    }),
    channel: {
      id: youtubeVideo.snippet.channelId,
      name: youtubeVideo.snippet.channelTitle,
      avatar: channelData?.snippet.thumbnails.default?.url || "/placeholder.svg",
      verified: false, // YouTube API doesn't provide this directly
      subscribers: channelData
        ? formatSubscriberCount(Number.parseInt(channelData.statistics.subscriberCount || "0", 10))
        : "0 subscribers",
    },
  }
}
