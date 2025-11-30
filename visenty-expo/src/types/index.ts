export type EventType = 'PAST_OFFENDER' | 'SHOPLIFTING';

export interface Offender {
  id: string;
  name: string;
  profileImage?: string;
  totalIncidents: number;
  lastIncidentDate: string;
  areaOfActivity: string[];
  storeTypes: string[];
  notes?: string;
  allIncidents?: Event[]; // All incidents involving this offender
}

export interface VideoClip {
  id: string;
  url: string | number; // Can be a URL string or a require() asset number
  thumbnail?: string | number; // Can be a URL string, require() asset number, or undefined (will use video first frame)
  timestamp: string;
  duration: number;
}

export interface Store {
  id: string;
  name: string;
  address: string;
}

export interface Event {
  id: string;
  type: EventType;
  timestamp: string;
  store: Store;
  summary: string;
  offender?: Offender;
  videoClips: VideoClip[];
  metadata?: {
    detectedItems?: string[];
    location?: string;
    reviewed?: boolean;
    notes?: string;
    potentialOffender?: Offender; // Facial recognition match from offender database
    matchConfidence?: number; // Confidence score (0-100)
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  apiToken?: string;
  stores: Store[];
}

export interface AuthCredentials {
  email: string;
  password: string;
}

