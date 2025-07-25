"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Lightbulb, Target, Code, BookOpen, Sparkles } from "lucide-react"

const highlights = [
  {
    id: "1",
    timestamp: "8:45",
    title: "useEffect Deep Dive",
    type: "concept" as const,
  },
  {
    id: "2",
    timestamp: "15:10",
    title: "Best Practices",
    type: "tip" as const,
  },
  {
    id: "3",
    timestamp: "22:30",
    title: "Common Mistakes",
    type: "example" as const,
  },
  {
    id: "4",
    timestamp: "28:45",
    title: "Practical Example",
    type: "summary" as const,
  },
  {
    id: "5",
    timestamp: "35:20",
    title: "Performance Tips",
    type: "tip" as const,
  },
  {
    id: "6",
    timestamp: "42:15",
    title: "Advanced Patterns",
    type: "concept" as const,
  },
  {
    id: "7",
    timestamp: "48:30",
    title: "Real-world Implementation",
    type: "example" as const,
  },
  {
    id: "8",
    timestamp: "55:10",
    title: "Key Takeaways",
    type: "summary" as const,
  },
]

function getTypeIcon(type: string) {
  switch (type) {
    case "concept":
      return Lightbulb
    case "tip":
      return Target
    case "example":
      return Code
    case "summary":
      return BookOpen
    default:
      return Lightbulb
  }
}

export function AIHighlights() {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-black" />
          <h3 className="text-lg font-semibold text-black">Video Highlights</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-200 rounded-md transition-colors duration-200"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Timeline Content */}
      {isExpanded && (
        <div className="p-4 max-h-80 overflow-y-auto">
          <div className="relative">
            {/* Single timeline line */}
            <div className="absolute left-6 top-6 bottom-0 w-px bg-gray-400"></div>

            <div className="space-y-4">
              {highlights.map((highlight, index) => {
                const IconComponent = getTypeIcon(highlight.type)

                return (
                  <div key={highlight.id} className="relative flex items-start space-x-4 group">
                    {/* Timeline dot with icon */}
                    <div className="relative z-10 w-12 h-12 bg-gray-100 border-2 border-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-black" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-gray-200 text-black">
                          {highlight.timestamp}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-black group-hover:text-gray-600 transition-colors duration-200 cursor-pointer">
                        {highlight.title}
                      </h4>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
