"use client"
import { Play, MessageCircle, FileText, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationRailProps {
  currentMode: "video" | "chat" | "notes"
  onModeChange: (mode: "video" | "chat" | "notes") => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export function NavigationRail({ currentMode, onModeChange, isCollapsed, onToggleCollapse }: NavigationRailProps) {
  const navigationItems = [
    {
      id: "video" as const,
      label: "Video Mode",
      description: "Focus on learning",
      icon: Play,
    },
    {
      id: "chat" as const,
      label: "AI Assistant",
      description: "Ask questions",
      icon: MessageCircle,
    },
    {
      id: "notes" as const,
      label: "Smart Notes",
      description: "AI-powered notes",
      icon: FileText,
    },
  ]

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Play className="h-4 w-4 text-white fill-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-black truncate">EduTube</h1>
              <p className="text-xs text-gray-600 truncate">Smart Learning Platform</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Items */}
      <div className="p-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = currentMode === item.id
          const IconComponent = item.icon

          return (
            <button
              key={item.id}
              onClick={() => onModeChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200",
                "hover:bg-gray-50",
                isActive ? "bg-gray-100 border border-gray-200" : "hover:bg-gray-50",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
                  isActive ? "bg-white shadow-sm border border-gray-200" : "bg-gray-100",
                )}
              >
                <IconComponent
                  className={cn("h-4 w-4 transition-colors duration-200", isActive ? "text-gray-900" : "text-gray-600")}
                />
              </div>
              {!isCollapsed && (
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{item.label}</div>
                  <div className="text-xs text-gray-600 truncate">{item.description}</div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3 text-gray-600" />
        ) : (
          <ChevronLeft className="h-3 w-3 text-gray-600" />
        )}
      </button>
    </div>
  )
}
