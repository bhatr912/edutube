// YouTube API Response Types
export interface YouTubeSearchResponse {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  regionCode: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeSearchItem[]
}

export interface YouTubeSearchItem {
  kind: string
  etag: string
  id: {
    kind: string
    videoId: string
  }
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: YouTubeThumbnails
    channelTitle: string
    liveBroadcastContent: string
    publishTime: string
  }
}

export interface YouTubeVideoResponse {
  kind: string
  etag: string
  items: YouTubeVideoItem[]
}

export interface YouTubeVideoItem {
  kind: string
  etag: string
  id: string
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: YouTubeThumbnails
    channelTitle: string
    tags?: string[]
    categoryId: string
    liveBroadcastContent: string
    defaultLanguage?: string
    defaultAudioLanguage?: string
  }
  contentDetails: {
    duration: string
    dimension: string
    definition: string
    caption: string
    licensedContent: boolean
    contentRating: {}
    projection: string
  }
  statistics: {
    viewCount: string
    likeCount?: string
    dislikeCount?: string
    favoriteCount: string
    commentCount?: string
  }
}

export interface YouTubeThumbnails {
  default: YouTubeThumbnail
  medium: YouTubeThumbnail
  high: YouTubeThumbnail
  standard?: YouTubeThumbnail
  maxres?: YouTubeThumbnail
}

export interface YouTubeThumbnail {
  url: string
  width: number
  height: number
}

export interface YouTubeChannelResponse {
  kind: string
  etag: string
  items: YouTubeChannelItem[]
}

export interface YouTubeChannelItem {
  kind: string
  etag: string
  id: string
  snippet: {
    title: string
    description: string
    customUrl?: string
    publishedAt: string
    thumbnails: YouTubeThumbnails
    country?: string
  }
  statistics: {
    viewCount: string
    subscriberCount: string
    hiddenSubscriberCount: boolean
    videoCount: string
  }
}

export interface YouTubeCommentsResponse {
  kind: string
  etag: string
  nextPageToken?: string
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
  items: YouTubeCommentItem[]
}

export interface YouTubeCommentItem {
  kind: string
  etag: string
  id: string
  snippet: {
    videoId: string
    topLevelComment: {
      kind: string
      etag: string
      id: string
      snippet: {
        videoId: string
        textDisplay: string
        textOriginal: string
        authorDisplayName: string
        authorProfileImageUrl: string
        authorChannelUrl: string
        authorChannelId: {
          value: string
        }
        canRate: boolean
        totalReplyCount: number
        likeCount: number
        publishedAt: string
        updatedAt: string
      }
    }
    canReply: boolean
    totalReplyCount: number
    isPublic: boolean
  }
}
