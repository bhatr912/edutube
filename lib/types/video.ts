export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: number // in seconds
  views: number
  publishedAt: Date
  channel: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
  tags: string[]
  videoUrl: string
}
