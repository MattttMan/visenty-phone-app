import { Event } from '../../types';
import { mockStores } from './stores';
import { mockOffenders } from './offenders';
import { videoAssets } from './videoAssets';

/**
 * Mock Events Data
 * 
 * Contains all shoplifting and past offender incidents
 */

// Create all incidents for John Doe first
export const johnDoeIncidents: Event[] = [
  {
    id: 'evt1',
    type: 'PAST_OFFENDER',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    store: mockStores[0],
    summary: 'Past Offender: John Doe entered store #12',
    offender: mockOffenders[0],
    videoClips: [
      {
        id: 'vid1',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        duration: 15,
      },
      {
        id: 'vid2',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=2',
        timestamp: '2024-11-28T14:30:00Z',
        duration: 30,
      },
    ],
  },
  {
    id: 'evt1b',
    type: 'SHOPLIFTING',
    timestamp: '2024-11-20T10:00:00Z',
    store: mockStores[0],
    summary: 'Shoplifting incident - John Doe',
    offender: mockOffenders[0],
    videoClips: [
      {
        id: 'vid1b',
        url: videoAssets.incident1,
        thumbnail: videoAssets.incident1, // Use video as thumbnail
        timestamp: '2024-11-20T10:00:00Z',
        duration: 25,
      },
    ],
    metadata: {
      detectedItems: ['Electronics'],
      location: 'Aisle 5',
    },
  },
  {
    id: 'evt1c',
    type: 'SHOPLIFTING',
    timestamp: '2024-11-15T14:20:00Z',
    store: mockStores[1],
    summary: 'Shoplifting incident - John Doe',
    offender: mockOffenders[0],
    videoClips: [
      {
        id: 'vid1c',
        url: videoAssets.incident2,
        thumbnail: videoAssets.incident2, // Use video as thumbnail
        timestamp: '2024-11-15T14:20:00Z',
        duration: 20,
      },
    ],
    metadata: {
      detectedItems: ['Clothing'],
      location: 'Register #2',
    },
  },
  {
    id: 'evt1d',
    type: 'SHOPLIFTING',
    timestamp: '2024-11-10T16:45:00Z',
    store: mockStores[2],
    summary: 'Shoplifting incident - John Doe',
    offender: mockOffenders[0],
    videoClips: [
      {
        id: 'vid1d',
        url: videoAssets.incident3,
        thumbnail: videoAssets.incident3, // Use video as thumbnail
        timestamp: '2024-11-10T16:45:00Z',
        duration: 18,
      },
    ],
    metadata: {
      detectedItems: ['Accessories'],
      location: 'Exit',
    },
  },
  {
    id: 'evt1e',
    type: 'SHOPLIFTING',
    timestamp: '2024-11-05T11:30:00Z',
    store: mockStores[0],
    summary: 'Shoplifting incident - John Doe',
    offender: mockOffenders[0],
    videoClips: [
      {
        id: 'vid1e',
        url: videoAssets.incident4,
        thumbnail: videoAssets.incident4, // Use video as thumbnail
        timestamp: '2024-11-05T11:30:00Z',
        duration: 22,
      },
    ],
    metadata: {
      detectedItems: ['Electronics', 'Accessories'],
      location: 'Aisle 3',
    },
  },
];

export const mockEvents: Event[] = [
  {
    ...johnDoeIncidents[0],
    offender: {
      ...mockOffenders[0],
      allIncidents: johnDoeIncidents,
    },
  },
  {
    id: 'evt2',
    type: 'SHOPLIFTING',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    store: mockStores[0],
    summary: 'Shoplifting detected at register #3',
    videoClips: [
      {
        id: 'vid3',
        url: videoAssets.cctvStore,
        thumbnail: videoAssets.cctvStore, // Use video as thumbnail
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        duration: 45,
      },
    ],
    metadata: {
      detectedItems: ['Electronics', 'Accessories'],
      location: 'Register #3',
      reviewed: false,
      potentialOffender: mockOffenders[0], // Facial recognition match with John Doe
      matchConfidence: 92, // 92% confidence match
    },
  },
  {
    id: 'evt3',
    type: 'PAST_OFFENDER',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    store: mockStores[1],
    summary: 'Past Offender: Jane Smith entered store #15',
    offender: {
      ...mockOffenders[1],
      allIncidents: [
        {
          id: 'jane1',
          type: 'SHOPLIFTING',
          timestamp: '2024-11-25T10:15:00Z',
          store: mockStores[1],
          summary: 'Shoplifting incident - Jane Smith',
          offender: mockOffenders[1],
          videoClips: [
            {
              id: 'jane-vid1',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnail: 'https://picsum.photos/400/300?random=4',
              timestamp: '2024-11-25T10:15:00Z',
              duration: 20,
            },
          ],
          metadata: {
            detectedItems: ['Clothing', 'Accessories'],
            location: 'Aisle 2',
          },
        },
        {
          id: 'jane2',
          type: 'SHOPLIFTING',
          timestamp: '2024-11-20T14:30:00Z',
          store: mockStores[0],
          summary: 'Shoplifting incident - Jane Smith',
          offender: mockOffenders[1],
          videoClips: [
            {
              id: 'jane-vid2',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
              thumbnail: 'https://picsum.photos/400/300?random=5',
              timestamp: '2024-11-20T14:30:00Z',
              duration: 18,
            },
          ],
          metadata: {
            detectedItems: ['Accessories'],
            location: 'Register #1',
          },
        },
      ],
    },
    videoClips: [
      {
        id: 'vid4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        duration: 20,
      },
    ],
  },
  {
    id: 'evt4',
    type: 'SHOPLIFTING',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    store: mockStores[2],
    summary: 'Shoplifting detected - item concealment',
    videoClips: [
      {
        id: 'vid5',
        url: videoAssets.incident1,
        thumbnail: videoAssets.incident1, // Use video as thumbnail
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        duration: 25,
      },
    ],
    metadata: {
      detectedItems: ['Clothing', 'Accessories'],
      location: 'Aisle 7',
      reviewed: true,
      potentialOffender: mockOffenders[0], // Facial recognition match with John Doe
      matchConfidence: 87, // 87% confidence match
    },
  },
  {
    id: 'evt5',
    type: 'SHOPLIFTING',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    store: mockStores[0],
    summary: 'Unpaid exit detected',
    videoClips: [
      {
        id: 'vid6',
        url: videoAssets.incident2,
        thumbnail: videoAssets.incident2, // Use video as thumbnail
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        duration: 18,
      },
    ],
    metadata: {
      detectedItems: ['Multiple items'],
      location: 'Exit',
      reviewed: true,
    },
  },
];

