# Mock Data

This folder contains all mock data for development and testing.

## Structure

- **stores.ts** - Mock store locations
- **offenders.ts** - Mock offender profiles  
- **events.ts** - Mock shoplifting and past offender incidents
- **videoAssets.ts** - Local video file references
- **index.ts** - Main export file with API functions

## Usage

```typescript
import { getMockEvents, mockStores, mockOffenders } from '../services/mockData';
```

## Video Files

Local video files are stored in `assets/videos/` and referenced in `videoAssets.ts`.

To add new videos:
1. Add video file to `assets/videos/`
2. Import it in `videoAssets.ts`
3. Use it in `events.ts`

