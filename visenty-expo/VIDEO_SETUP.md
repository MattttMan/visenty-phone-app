# Video Setup Guide

## How to Add Your Own Shoplifting Incident Videos

### ✅ YouTube Links Supported!

You can now use YouTube links directly! The app will automatically detect YouTube URLs and open them in the YouTube app (or browser if app isn't installed).

**Example:**
```typescript
videoClips: [
  {
    id: 'vid1',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // YouTube link
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', // Optional
    timestamp: '2024-11-30T14:30:00Z',
    duration: 15,
  },
]
```

**Supported YouTube URL formats:**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

### Option 1: Local Video Assets (For Development)

1. **Add videos to your project:**
   - Create a folder: `assets/videos/`
   - Place your video files there (e.g., `incident1.mp4`, `incident2.mp4`)

2. **Update mockData.ts:**
   ```typescript
   videoClips: [
     {
       id: 'vid1',
       url: require('../assets/videos/incident1.mp4'), // Local file
       thumbnail: require('../assets/videos/thumbnails/incident1.jpg'), // Optional thumbnail
       timestamp: '2024-11-30T14:30:00Z',
       duration: 15,
     },
   ]
   ```

### Option 2: Cloud Storage URLs (For Production)

1. **Upload videos to cloud storage:**
   - AWS S3, Cloudinary, Google Cloud Storage, etc.
   - Get public URLs for your videos

2. **Update mockData.ts:**
   ```typescript
   videoClips: [
     {
       id: 'vid1',
       url: 'https://your-storage.com/videos/incident1.mp4', // Cloud URL
       thumbnail: 'https://your-storage.com/thumbnails/incident1.jpg',
       timestamp: '2024-11-30T14:30:00Z',
       duration: 15,
     },
   ]
   ```

### Option 3: Backend API (Recommended for Production)

1. **Connect to your backend:**
   - Update `src/services/api.ts` to fetch real events
   - Replace `getMockEvents()` with actual API calls
   - Videos will come from your server

2. **Example API response:**
   ```json
   {
     "id": "evt1",
     "type": "SHOPLIFTING",
     "videoClips": [
       {
         "id": "vid1",
         "url": "https://api.visenty.com/videos/incident1.mp4",
         "thumbnail": "https://api.visenty.com/thumbnails/incident1.jpg",
         "timestamp": "2024-11-30T14:30:00Z",
         "duration": 15
       }
     ]
   }
   ```

## Current Setup

Right now, the app uses placeholder videos from Google's sample video bucket for testing. To use real videos:

1. Replace the `url` fields in `src/services/mockData.ts`
2. Replace the `thumbnail` fields with actual video thumbnails
3. Update the `duration` to match your actual video length

## Video Format Recommendations

- **Format:** MP4 (H.264 codec recommended)
- **Resolution:** 720p or 1080p
- **Max file size:** Keep under 50MB for mobile performance
- **Thumbnails:** JPG or PNG, 400x300px recommended

