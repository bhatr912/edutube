"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type { Video } from "@/lib/types/video"

interface VideoPlayerProps {
  video: Video
  isFullscreen?: boolean
  onFullscreenToggle?: () => void
}

// YouTube Player API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export function VideoPlayer({ video, isFullscreen = false, onFullscreenToggle }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState([0])
  const [showControls, setShowControls] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const youtubePlayerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressUpdateRef = useRef<NodeJS.Timeout | null>(null)

  // Check if URL is YouTube
  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  const handlePlayPause = () => {
    if (isYouTubeUrl(video.videoUrl)) {
      if (youtubePlayerRef.current) {
        if (isPlaying) {
          youtubePlayerRef.current.pauseVideo()
        } else {
          youtubePlayerRef.current.playVideo()
        }
      }
    } else {
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause()
        } else {
          videoRef.current.play()
        }
        setIsPlaying(!isPlaying)
      }
    }
  }

  const handleVolumeToggle = () => {
    if (isYouTubeUrl(video.videoUrl)) {
      if (youtubePlayerRef.current) {
        if (isMuted) {
          youtubePlayerRef.current.unMute()
          setIsMuted(false)
        } else {
          youtubePlayerRef.current.mute()
          setIsMuted(true)
        }
      }
    } else {
      if (videoRef.current) {
        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (isYouTubeUrl(video.videoUrl)) {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.setVolume(value[0])
        setVolume(value)
        if (value[0] === 0) {
          youtubePlayerRef.current.mute()
          setIsMuted(true)
        } else if (isMuted) {
          youtubePlayerRef.current.unMute()
          setIsMuted(false)
        }
      }
    } else {
      if (videoRef.current) {
        const newVolume = value[0] / 100
        videoRef.current.volume = newVolume
        setVolume(value)
        if (newVolume === 0) {
          setIsMuted(true)
          videoRef.current.muted = true
        } else if (isMuted) {
          setIsMuted(false)
          videoRef.current.muted = false
        }
      }
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (isYouTubeUrl(video.videoUrl)) {
      if (youtubePlayerRef.current && duration > 0) {
        const newTime = (value[0] / 100) * duration
        youtubePlayerRef.current.seekTo(newTime, true)
        setCurrentTime(newTime)
        setProgress(value)
      }
    } else {
      if (videoRef.current && duration > 0) {
        const newTime = (value[0] / 100) * duration
        videoRef.current.currentTime = newTime
        setCurrentTime(newTime)
        setProgress(value)
      }
    }
  }

  const handleSkipBack = () => {
    if (isYouTubeUrl(video.videoUrl)) {
      if (youtubePlayerRef.current) {
        const currentTime = youtubePlayerRef.current.getCurrentTime()
        youtubePlayerRef.current.seekTo(Math.max(0, currentTime - 10), true)
      }
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
      }
    }
  }

  const handleSkipForward = () => {
    if (isYouTubeUrl(video.videoUrl)) {
      if (youtubePlayerRef.current) {
        const currentTime = youtubePlayerRef.current.getCurrentTime()
        youtubePlayerRef.current.seekTo(Math.min(duration, currentTime + 10), true)
      }
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10)
      }
    }
  }

  const handleVideoClick = () => {
    handlePlayPause()
  }

  // YouTube player setup
  useEffect(() => {
    if (!isYouTubeUrl(video.videoUrl)) return

    const initializeYouTubePlayer = () => {
      const videoId = getYouTubeVideoId(video.videoUrl)
      if (!videoId || !playerContainerRef.current) return

      youtubePlayerRef.current = new window.YT.Player(playerContainerRef.current, {
        width: '100%',
        height: '100%',
        videoId: videoId,
        playerVars: {
          controls: 1,
          modestbranding: 1,
          rel: 0,
          showinfo: 1,
          fs: 1,
          cc_load_policy: 1,
          iv_load_policy: 1,
          autohide: 0
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration())
            setVolume([event.target.getVolume()])
            setIsLoading(false)
          },
          onStateChange: (event: any) => {
            const playerState = event.data
            setIsPlaying(playerState === window.YT.PlayerState.PLAYING)
          }
        }
      })
    }

    // Load YouTube API if not already loaded
    if (typeof window !== 'undefined') {
      if (window.YT && window.YT.Player) {
        initializeYouTubePlayer()
      } else {
        // Load YouTube API
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        }

        window.onYouTubeIframeAPIReady = initializeYouTubePlayer
      }
    }

    return () => {
      if (progressUpdateRef.current) {
        clearTimeout(progressUpdateRef.current)
      }
      if (youtubePlayerRef.current && youtubePlayerRef.current.destroy) {
        youtubePlayerRef.current.destroy()
      }
    }
  }, [video.videoUrl])

  // Regular video setup
  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement || isYouTubeUrl(video.videoUrl)) return

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration)
      setIsLoading(false)
    }

    const handleTimeUpdate = () => {
      const current = videoElement.currentTime
      const total = videoElement.duration
      setCurrentTime(current)
      if (total > 0) {
        setProgress([(current / total) * 100])
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setProgress([0])
      setCurrentTime(0)
    }

    const handleVolumeChange = () => {
      setVolume([videoElement.volume * 100])
      setIsMuted(videoElement.muted)
    }

    videoElement.addEventListener("loadedmetadata", handleLoadedMetadata)
    videoElement.addEventListener("timeupdate", handleTimeUpdate)
    videoElement.addEventListener("play", handlePlay)
    videoElement.addEventListener("pause", handlePause)
    videoElement.addEventListener("ended", handleEnded)
    videoElement.addEventListener("volumechange", handleVolumeChange)

    // Set initial volume
    videoElement.volume = volume[0] / 100

    return () => {
      videoElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      videoElement.removeEventListener("timeupdate", handleTimeUpdate)
      videoElement.removeEventListener("play", handlePlay)
      videoElement.removeEventListener("pause", handlePause)
      videoElement.removeEventListener("ended", handleEnded)
      videoElement.removeEventListener("volumechange", handleVolumeChange)

      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [volume, video.videoUrl])

  return (
    <div
      className={cn(
        "relative group bg-black overflow-hidden transition-all duration-300",
        isFullscreen ? "w-full h-full" : "w-full aspect-video rounded-xl shadow-2xl",
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* YouTube Player or Regular Video */}
      {isYouTubeUrl(video.videoUrl) ? (
        <div 
          ref={playerContainerRef}
          className="w-full h-full"
        />
      ) : (
        <video
          ref={videoRef}
          src={video.videoUrl}
          className="w-full h-full object-contain cursor-pointer"
          onClick={handleVideoClick}
          preload="metadata"
          crossOrigin="anonymous"
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}

      {/* Video Controls Overlay - Only for non-YouTube videos */}
      {!isYouTubeUrl(video.videoUrl) && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 pointer-events-none",
            showControls ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Center Play Button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "text-white hover:bg-white/20 transition-all duration-200 rounded-full border border-white/20 backdrop-blur-sm",
                isFullscreen ? "w-20 h-20" : "w-16 h-16",
              )}
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className={cn(isFullscreen ? "h-8 w-8" : "h-6 w-6")} />
              ) : (
                <Play className={cn(isFullscreen ? "h-8 w-8 ml-1" : "h-6 w-6 ml-1")} />
              )}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4 pointer-events-auto">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={progress}
                onValueChange={handleProgressChange}
                max={100}
                step={0.1}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-white/80">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 transition-colors rounded-full"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 transition-colors rounded-full"
                  onClick={handleSkipBack}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 transition-colors rounded-full"
                  onClick={handleSkipForward}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 transition-colors rounded-full"
                    onClick={handleVolumeToggle}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={volume}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 transition-colors rounded-full"
                >
                  <Settings className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 transition-colors rounded-full"
                  onClick={onFullscreenToggle}
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
