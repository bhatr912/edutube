"use client"

import { X, Play, MessageCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface DrawerMenuProps {
  open: boolean
  onClose: () => void
  currentMode: "video" | "chat" | "note"
  onModeChange: (mode: "video" | "chat" | "note") => void
}

export function DrawerMenu({ open, onClose, currentMode, onModeChange }: DrawerMenuProps) {
  const menuItems = [
    {
      id: "video" as const,
      label: "Video Mode",
      icon: Play,
      description: "Watch video with comments and highlights",
    },
    {
      id: "chat" as const,
      label: "Chat Mode",
      icon: MessageCircle,
      description: "Live chat and discussions",
    },
    {
      id: "note" as const,
      label: "Note Mode",
      icon: FileText,
      description: "Take notes while watching",
    },
  ]

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 z-50 border-r border-gray-200",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Learning Modes</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = currentMode === item.id

            return (
              <div key={item.id}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start p-4 h-auto transition-all duration-200",
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
                  )}
                  onClick={() => onModeChange(item.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", isActive ? "text-white" : "text-gray-500")} />
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className={cn("text-xs mt-1", isActive ? "text-blue-100" : "text-gray-500")}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Button>
                {index < menuItems.length - 1 && <Separator className="my-2" />}
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-600 text-center">Switch between modes to enhance your learning experience</p>
        </div>
      </div>
    </>
  )
}
