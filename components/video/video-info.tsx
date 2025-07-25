import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { formatViewCount } from "@/lib/utils/format"
import { formatDistanceToNow } from "date-fns"
import type { Video } from "@/lib/types/video"

interface VideoInfoProps {
  video: Video
}

export function VideoInfo({ video }: VideoInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Title and Stats */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{video.title}</h1>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              {formatViewCount(video.views)} views • {formatDistanceToNow(video.publishedAt, { addSuffix: true })}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-gray-50 transition-colors bg-transparent"
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="font-medium">1.2K</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-gray-50 transition-colors bg-transparent"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-gray-50 transition-colors bg-transparent"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2 hover:bg-gray-50 transition-colors bg-transparent"
              >
                <Download className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button variant="outline" size="sm" className="hover:bg-gray-50 transition-colors bg-transparent">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Channel Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12 ring-2 ring-gray-100">
              <AvatarImage src={video.channel.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {video.channel.name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{video.channel.name}</h3>
                {video.channel.verified && (
                  <div className="w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 font-medium">2.1M subscribers</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 hover:bg-gray-50 transition-colors bg-transparent"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 transition-colors">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 leading-relaxed">{video.description}</p>
        </div>
      </div>
    </div>
  )
}
