export type EventType = 'PAST_OFFENDER' | 'SHOPLIFTING';

export interface Offender {
  id: string;
  name: string;
  profileImage?: string;
  totalIncidents: number;
  lastIncidentDate: string;
  notes?: string;
}

export interface VideoClip {
  id: string;
  url: string;
  thumbnail: string;
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

