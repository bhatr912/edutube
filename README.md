# YouTube Clone with Real YouTube API Integration

A professional YouTube clone built with Next.js 14, TypeScript, and the YouTube Data API v3. This application provides a complete video streaming experience with search, video playback, comments, and AI-powered features.

## Features

### 🎥 Video Features
- **Real YouTube Integration**: Uses YouTube Data API v3 for all video data
- **Video Search**: Search across YouTube's entire catalog
- **Video Playback**: Embedded YouTube player with custom controls
- **Related Videos**: AI-powered related video suggestions
- **Comments System**: Real YouTube comments integration

### 🤖 AI-Powered Features
- **Smart Learning Modes**: Video, Chat, and Notes modes
- **AI Highlights**: Automatically generated video highlights
- **AI Assistant**: Chat with AI about video content
- **Smart Notes**: AI-powered note-taking with suggestions

### 🎨 Modern UI/UX
- **Responsive Design**: Works on all devices
- **Dark/Light Mode**: Theme switching support
- **Smooth Animations**: Framer Motion animations
- **Professional Design**: Clean, modern interface

## Setup Instructions

### 1. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the API key to YouTube Data API v3

### 2. Environment Setup

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
NEXT_PUBLIC_YOUTUBE_REGION_CODE=US
NEXT_PUBLIC_YOUTUBE_LANGUAGE=en
\`\`\`

### 3. Installation

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start
\`\`\`

## API Integration

### YouTube Data API v3

The application uses the following YouTube API endpoints:

- **Search**: `/search` - Search for videos
- **Videos**: `/videos` - Get video details, statistics
- **Channels**: `/channels` - Get channel information
- **Comments**: `/commentThreads` - Get video comments

### API Usage Examples

\`\`\`typescript
// Search videos
const searchResponse = await youtubeAPI.searchVideos('react tutorial', {
  maxResults: 12,
  order: 'relevance'
})

// Get video details
const videoResponse = await youtubeAPI.getVideoById('dQw4w9WgXcQ')

// Get video comments
const commentsResponse = await youtubeAPI.getVideoComments('dQw4w9WgXcQ')
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── search/            # Search page
│   └── watch/             # Video watch page
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── video/            # Video-related components
│   └── ui/               # UI components (shadcn/ui)
├── lib/                  # Utilities and services
│   ├── config/           # Configuration files
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
└── public/               # Static assets
\`\`\`

## Key Components

### YouTube API Service (`lib/services/youtube-api.ts`)
- Centralized API client for YouTube Data API
- Error handling and response transformation
- Rate limiting and caching support

### Custom Hooks (`lib/hooks/use-youtube-data.ts`)
- `useYouTubeSearch`: Search videos with pagination
- `useYouTubeVideo`: Get video details and related content
- `usePopularVideos`: Get trending/popular videos

### Video Components
- `VideoPlayer`: Custom YouTube player with controls
- `VideoCard`: Video thumbnail and metadata display
- `VideoInfo`: Video details, likes, channel info
- `Comments`: Real YouTube comments integration

## Performance Optimizations

### Caching Strategy
- API responses cached for 5 minutes
- Image optimization with Next.js Image component
- Lazy loading for video thumbnails

### Error Handling
- Comprehensive error boundaries
- Graceful API failure handling
- User-friendly error messages

### Loading States
- Skeleton loading components
- Progressive loading for better UX
- Optimistic updates where possible

## API Rate Limits

YouTube Data API v3 has the following limits:
- **Quota**: 10,000 units per day (default)
- **Search**: 100 units per request
- **Video Details**: 1 unit per video
- **Comments**: 1 unit per request

### Optimization Tips
- Cache API responses
- Batch video detail requests
- Use pagination effectively
- Implement request debouncing

## Deployment

### Vercel (Recommended)
\`\`\`bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key
\`\`\`

### Other Platforms
- **Netlify**: Add environment variables in site settings
- **Railway**: Set environment variables in project settings
- **Docker**: Use environment variables in container

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the [Issues](https://github.com/your-repo/issues) page
- Review the [YouTube API documentation](https://developers.google.com/youtube/v3)
- Contact support at your-email@example.com
