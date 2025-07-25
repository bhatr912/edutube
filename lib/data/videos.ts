import type { Video } from "@/lib/types/video"

// This file is now deprecated - keeping for reference only
// All video data now comes from YouTube API

// Legacy function - now replaced by YouTube API calls
export function getEducationalVideos(): Video[] {
  console.warn("getEducationalVideos is deprecated. Use YouTube API instead.")
  return []
}

export function getVideoById(id: string): Video | undefined {
  console.warn("getVideoById is deprecated. Use YouTube API instead.")
  return undefined
}
