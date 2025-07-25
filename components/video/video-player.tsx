"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward } from "lucide-react"
import { formatDuration } from "@/lib/utils/youtube-helpers"
import type { Video } from "@/lib/types/video"

interface VideoPlayerProps {
  video: Video
  isFullscreen?: boolean
  onFullscreenToggle?: () => void
}

export function VideoPlayer({ video, isFullscreen = false, onFullscreenToggle }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0])
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  const handleSkipForward = () => {
    setCurrentTime(Math.min(currentTime + 10, video.duration))
  }

  const handleSkipBack = () => {
    setCurrentTime(Math.max(currentTime - 10, 0))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && currentTime < video.duration) {
        setCurrentTime((prev) => Math.min(prev + 1, video.duration))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, currentTime, video.duration])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={playerRef}
      className={`relative bg-black rounded-xl overflow-hidden group ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : "aspect-video"
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video/Iframe */}
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      ) : (
        <iframe
          src={video.embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      )}

      {/* Custom Controls Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Center Play/Pause Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="lg"
            onClick={handlePlayPause}
            className="w-16 h-16 rounded-full bg-black/50 hover:bg-black/70 text-white border-2 border-white/20"
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </Button>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <div className="space-y-1">
            <Slider value={[currentTime]} max={video.duration} step={1} onValueChange={handleSeek} className="w-full" />
            <div className="flex justify-between text-xs text-white/80">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(video.duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>

              <Button variant="ghost" size="sm" onClick={handleSkipBack} className="text-white hover:bg-white/20">
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="sm" onClick={handleSkipForward} className="text-white hover:bg-white/20">
                <SkipForward className="w-5 h-5" />
              </Button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleMuteToggle} className="text-white hover:bg-white/20">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Settings className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="sm" onClick={onFullscreenToggle} className="text-white hover:bg-white/20">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
