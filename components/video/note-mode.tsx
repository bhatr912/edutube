"use client"

import { Save, Download, FileText, Clock, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Video } from "@/lib/types/video"

interface NoteModeProps {
  video: Video
}

const aiSuggestions = [
  "Key concept: React Hooks fundamentals",
  "Important: useEffect dependency array",
  "Best practice: Custom hooks pattern",
  "Common mistake: Infinite re-renders",
]

export function NoteMode({ video }: NoteModeProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Smart Notes</h2>
              <p className="text-sm text-gray-600">AI-powered note taking for: {video.title}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-gray-50 bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Current timestamp: 15:30</span>
                  <Button variant="ghost" size="sm" className="text-xs text-gray-900 hover:text-gray-700">
                    Insert timestamp
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="Start taking notes... AI will suggest key points as you watch."
                className="min-h-[400px] resize-none border-none focus:ring-0 text-base p-6"
                defaultValue={`# React Hooks - Learning Notes

## 📝 Key Concepts Covered

### useState Hook (2:15)
- Manages component state
- Returns array with [state, setState]
- Triggers re-renders when state changes
- Example: const [count, setCount] = useState(0)

### useEffect Hook (8:45)
- Handles side effects
- Runs after component renders
- Dependency array controls when it runs
- Cleanup function prevents memory leaks

### Custom Hooks (15:10)
- Reusable stateful logic
- Must start with "use"
- Can call other hooks
- Great for sharing logic between components

## 🎯 Best Practices
- Always call hooks at top level
- Use dependency arrays properly
- Create custom hooks for reusable logic
- Clean up subscriptions and timers

## ❓ Questions to Review
- How to optimize re-renders?
- When to use useCallback vs useMemo?
- Best patterns for custom hooks?`}
              />
            </div>
          </div>

          {/* AI Suggestions Sidebar */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-4 w-4 text-gray-900" />
                <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
              </div>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full text-left justify-start p-2 h-auto text-xs hover:bg-white text-gray-700"
                  >
                    <Tag className="h-3 w-3 mr-2 flex-shrink-0" />
                    <span className="line-clamp-2">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  📋 Copy current timestamp
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  🔖 Add bookmark
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  💡 Generate summary
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  🏷️ Add tags
                </Button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Note Stats</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Words:</span>
                  <span className="font-medium">247</span>
                </div>
                <div className="flex justify-between">
                  <span>Timestamps:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Last saved:</span>
                  <span className="font-medium">2 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
