"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  onMenuClick?: () => void
  showMenuIcon?: boolean
  hideLogoOnWatch?: boolean
}

export function Header({ onMenuClick, showMenuIcon = false, hideLogoOnWatch = false }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          {/* Logo - Only show when not on watch page with nav rail */}
          {!hideLogoOnWatch && (
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600">
                <div className="h-4 w-4 bg-white" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
              </div>
              <span className="text-xl font-semibold text-gray-900">EduTube</span>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl mx-8">
          <div className="flex w-full border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-500 focus-within:shadow-sm">
            <Input
              type="search"
              placeholder="Search educational videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-0 rounded-none px-4 py-2 h-10 focus:ring-0 focus:outline-none bg-white shadow-none"
            />
            <Button
              type="submit"
              variant="ghost"
              className="border-0 rounded-none px-6 h-10 hover:bg-gray-50 bg-gray-50/50 shadow-none"
            >
              <Search className="h-4 w-4 text-gray-600" />
            </Button>
          </div>
        </form>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
