import { Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Video } from "@/lib/types/video"

interface ChatModeProps {
  video: Video
}

const mockMessages = [
  {
    id: "1",
    type: "ai" as const,
    message:
      "Hi! I'm your AI learning assistant. I can help you understand concepts from this video. What would you like to know?",
    timestamp: "Just now",
  },
  {
    id: "2",
    type: "user" as const,
    message: "Can you explain the difference between useState and useEffect?",
    timestamp: "2:15",
  },
  {
    id: "3",
    type: "ai" as const,
    message:
      "Great question! useState manages component state, while useEffect handles side effects like API calls or subscriptions. useState triggers re-renders when state changes, useEffect runs after renders.",
    timestamp: "2:16",
  },
  {
    id: "4",
    type: "user" as const,
    message: "When should I use the dependency array in useEffect?",
    timestamp: "5:30",
  },
  {
    id: "5",
    type: "ai" as const,
    message:
      "The dependency array controls when useEffect runs:\n• Empty array [] = runs once on mount\n• No array = runs on every render\n• [value] = runs when 'value' changes",
    timestamp: "5:31",
  },
]

export function ChatMode({ video }: ChatModeProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Learning Assistant</h2>
            <p className="text-sm text-gray-600">Ask questions about: {video.title}</p>
          </div>
          <Badge variant="secondary" className="bg-gray-100 text-gray-900 border-gray-200">
            AI Powered
          </Badge>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl h-96 flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {mockMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={msg.type === "ai" ? "bg-gray-900 text-white" : "bg-gray-200"}>
                      {msg.type === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      msg.type === "user" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                    <span className={`text-xs mt-1 block ${msg.type === "user" ? "text-gray-300" : "text-gray-500"}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-3">
              <Input
                placeholder="Ask a question about the video..."
                className="flex-1 border-gray-200 focus:border-gray-900 focus:ring-gray-900"
              />
              <Button className="bg-gray-900 hover:bg-gray-800 text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">💡 Try asking: "Explain this concept" or "Give me an example"</p>
          </div>
        </div>
      </div>
    </div>
  )
}
