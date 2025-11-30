/**
 * Mock Data
 * 
 * Development and testing data for the Visenty Companion app
 * 
 * This folder contains all mock data organized by type:
 * - stores.ts: Mock store locations
 * - offenders.ts: Mock offender profiles
 * - events.ts: Mock shoplifting and past offender incidents
 * - videoAssets.ts: Local video file references
 */

export { mockStores } from './stores';
export { mockOffenders } from './offenders';
export { mockEvents, johnDoeIncidents } from './events';
export { videoAssets } from './videoAssets';

// Mock API functions
import { Event } from '../../types';
import { mockEvents, johnDoeIncidents } from './events';

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

// Helper function to get all incidents for an offender
export const getOffenderIncidents = (offenderId: string): Event[] => {
  if (offenderId === 'off1') {
    return johnDoeIncidents;
  }
  // For other offenders, return empty array or their incidents
  return [];
};

