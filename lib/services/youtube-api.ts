import { YOUTUBE_CONFIG, YOUTUBE_ENDPOINTS } from "@/lib/config/youtube"
import type {
  YouTubeSearchResponse,
  YouTubeVideoResponse,
  YouTubeChannelResponse,
  YouTubeCommentsResponse,
} from "@/lib/types/youtube"

class YouTubeAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "YouTubeAPIError"
  }
}

class YouTubeAPI {
  private baseUrl = YOUTUBE_CONFIG.BASE_URL
  private apiKey = YOUTUBE_CONFIG.API_KEY

  private async makeRequest<T>(endpoint: string, params: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    // Add API key and default params
    url.searchParams.append("key", this.apiKey)

    // Add custom params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })

    try {
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new YouTubeAPIError(
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof YouTubeAPIError) {
        throw error
      }
      throw new YouTubeAPIError(`Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async searchVideos(
    query: string,
    options: {
      maxResults?: number
      pageToken?: string
      order?: "date" | "rating" | "relevance" | "title" | "videoCount" | "viewCount"
      publishedAfter?: string
      publishedBefore?: string
      regionCode?: string
      relevanceLanguage?: string
      safeSearch?: "moderate" | "none" | "strict"
      videoCategoryId?: string
      videoDuration?: "any" | "long" | "medium" | "short"
      videoType?: "any" | "episode" | "movie"
    } = {},
  ): Promise<YouTubeSearchResponse> {
    const params = {
      part: "snippet",
      type: "video",
      q: query,
      maxResults: options.maxResults || YOUTUBE_CONFIG.DEFAULT_PARAMS.maxResults,
      order: options.order || YOUTUBE_CONFIG.DEFAULT_PARAMS.order,
      videoEmbeddable: "true",
      videoSyndicated: "true",
      ...options,
    }

    return this.makeRequest<YouTubeSearchResponse>(YOUTUBE_ENDPOINTS.SEARCH, params)
  }

  async getVideoDetails(videoIds: string[]): Promise<YouTubeVideoResponse> {
    const params = {
      part: "snippet,statistics,contentDetails",
      id: videoIds.join(","),
    }

    return this.makeRequest<YouTubeVideoResponse>(YOUTUBE_ENDPOINTS.VIDEOS, params)
  }

  async getVideoById(videoId: string): Promise<YouTubeVideoResponse> {
    return this.getVideoDetails([videoId])
  }

  async getChannelDetails(channelIds: string[]): Promise<YouTubeChannelResponse> {
    const params = {
      part: "snippet,statistics",
      id: channelIds.join(","),
    }

    return this.makeRequest<YouTubeChannelResponse>(YOUTUBE_ENDPOINTS.CHANNELS, params)
  }

  async getVideoComments(
    videoId: string,
    options: {
      maxResults?: number
      pageToken?: string
      order?: "time" | "relevance"
    } = {},
  ): Promise<YouTubeCommentsResponse> {
    const params = {
      part: "snippet",
      videoId,
      maxResults: options.maxResults || 20,
      order: options.order || "relevance",
      ...options,
    }

    return this.makeRequest<YouTubeCommentsResponse>(YOUTUBE_ENDPOINTS.COMMENTS, params)
  }

  async getPopularVideos(
    options: {
      maxResults?: number
      pageToken?: string
      regionCode?: string
      videoCategoryId?: string
    } = {},
  ): Promise<YouTubeSearchResponse> {
    return this.searchVideos("", {
      order: "viewCount",
      publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
      ...options,
    })
  }

  async getEducationalVideos(
    options: {
      maxResults?: number
      pageToken?: string
    } = {},
  ): Promise<YouTubeSearchResponse> {
    return this.searchVideos("tutorial programming education learning", {
      order: "relevance",
      videoCategoryId: "27", // Education category
      videoDuration: "medium",
      ...options,
    })
  }

  async getRelatedVideos(videoId: string, maxResults = 5): Promise<YouTubeSearchResponse> {
    // Get the video details first to extract relevant keywords
    const videoResponse = await this.getVideoById(videoId)
    const video = videoResponse.items[0]

    if (!video) {
      throw new YouTubeAPIError("Video not found")
    }

    // Extract keywords from title and tags
    const keywords = [...video.snippet.title.split(" ").slice(0, 3), ...(video.snippet.tags?.slice(0, 3) || [])].join(
      " ",
    )

    return this.searchVideos(keywords, {
      maxResults,
      order: "relevance",
    })
  }
}

export const youtubeAPI = new YouTubeAPI()
export { YouTubeAPIError }
