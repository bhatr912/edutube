import { Header } from "@/components/layout/header"
import { VideoList } from "@/components/video/video-list"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <VideoList />
      </main>
    </div>
  )
}
