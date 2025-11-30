import { Event, Offender, Store } from '../types';

// Mock data for development and testing
export const mockStores: Store[] = [
  { id: '1', name: 'Store #12 - Downtown', address: '123 Main St' },
  { id: '2', name: 'Store #15 - Westside', address: '456 Oak Ave' },
  { id: '3', name: 'Store #22 - Eastside', address: '789 Elm St' },
];

export const mockOffenders: Offender[] = [
  {
    id: 'off1',
    name: 'John Doe',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    totalIncidents: 5,
    lastIncidentDate: '2024-11-28T14:30:00Z',
    notes: 'Known for concealing items in jacket',
  },
  {
    id: 'off2',
    name: 'Jane Smith',
    profileImage: 'https://i.pravatar.cc/150?img=2',
    totalIncidents: 3,
    lastIncidentDate: '2024-11-25T10:15:00Z',
  },
];

export const mockEvents: Event[] = [
  {
    id: 'evt1',
    type: 'PAST_OFFENDER',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
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
    id: 'evt2',
    type: 'SHOPLIFTING',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    store: mockStores[0],
    summary: 'Shoplifting detected at register #3',
    videoClips: [
      {
        id: 'vid3',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=3',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        duration: 45,
      },
    ],
    metadata: {
      detectedItems: ['Electronics', 'Accessories'],
      location: 'Register #3',
      reviewed: false,
    },
  },
  {
    id: 'evt3',
    type: 'PAST_OFFENDER',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    store: mockStores[1],
    summary: 'Past Offender: Jane Smith entered store #15',
    offender: mockOffenders[1],
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
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    store: mockStores[2],
    summary: 'Shoplifting detected - item concealment',
    videoClips: [
      {
        id: 'vid5',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=5',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        duration: 25,
      },
    ],
    metadata: {
      detectedItems: ['Clothing', 'Accessories'],
      location: 'Aisle 7',
      reviewed: true,
    },
  },
  {
    id: 'evt5',
    type: 'SHOPLIFTING',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    store: mockStores[0],
    summary: 'Unpaid exit detected',
    videoClips: [
      {
        id: 'vid6',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail: 'https://picsum.photos/400/300?random=6',
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

// Mock API function to simulate network delay
export const getMockEvents = async (): Promise<Event[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEvents);
    }, 500);
  });
};

export const getMockEventById = async (id: string): Promise<Event | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEvents.find(e => e.id === id));
    }, 300);
  });
};

