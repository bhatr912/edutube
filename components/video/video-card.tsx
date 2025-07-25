import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatViewCount, formatDuration } from "@/lib/utils/format"
import type { Video } from "@/lib/types/video"

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      {/* Thumbnail */}
      <div className="relative flex-shrink-0">
        <Link href={`/watch?v=${video.id}`}>
          <div className="relative w-80 h-48 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={video.thumbnail || "/placeholder.svg"}
              alt={video.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
              {formatDuration(video.duration)}
            </div>
          </div>
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <Avatar className="w-10 h-10 flex-shrink-0 mt-1">
            <AvatarImage src={video.channel.avatar || "/placeholder.svg"} />
            <AvatarFallback>{video.channel.name.charAt(0)}</AvatarFallback>
          </Avatar>

          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <Link href={`/watch?v=${video.id}`}>
              <h3 className="text-lg font-medium text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
            </Link>

            <div className="mt-1 space-y-1">
              <Link
                href={`/channel/${video.channel.id}`}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {video.channel.name}
                {video.channel.verified && <span className="ml-1 text-gray-400">✓</span>}
              </Link>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatViewCount(video.views)} views</span>
                <span>•</span>
                <span>{formatDistanceToNow(video.publishedAt, { addSuffix: true })}</span>
              </div>
            </div>

            <p className="mt-2 text-sm text-gray-600 line-clamp-2">{video.description}</p>

            {/* Tags */}
            <div className="mt-3 flex flex-wrap gap-2">
              {video.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
