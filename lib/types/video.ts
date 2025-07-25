export interface Channel {
  id: string
  name: string
  avatar: string
  verified: boolean
  subscribers: string
}

export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: number // in seconds
  views: number
  likes: number
  comments: number
  publishedAt: Date
  channelId: string
  channelName: string
  channelThumbnailUrl: string
  subscriberCount: number
  tags: string[]
  category: string
  url: string
  embedUrl: string
  channel: Channel
}

export interface Comment {
  id: string
  author: {
    name: string
    avatar: string
    channelId?: string
  }
  content: string
  likes: number
  publishedAt: Date
  replyCount: number
  replies?: CommentReply[]
}

export interface CommentReply {
  id: string
  author: {
    name: string
    avatar: string
    channelId?: string
  }
  content: string
  likes: number
  publishedAt: Date
}
