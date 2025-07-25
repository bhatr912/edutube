"use client"

import { Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function WatchHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left spacer */}
        <div className="w-20" />

        {/* Center - Search Bar (increased width like home page) */}
        <div className="flex flex-1 max-w-3xl mx-8">
          <div className="flex w-full border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 focus-within:shadow-sm bg-white">
            <Input
              type="search"
              placeholder="Search educational videos..."
              className="flex-1 border-0 rounded-none px-4 py-2 h-10 focus:ring-0 focus:outline-none bg-transparent shadow-none"
            />
            <Button
              variant="ghost"
              className="border-0 rounded-none px-6 h-10 hover:bg-gray-50 bg-gray-50/50 shadow-none"
            >
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4 w-20 justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8 ring-2 ring-gray-100">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-gray-200">
              <User className="h-4 w-4 text-gray-600" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
