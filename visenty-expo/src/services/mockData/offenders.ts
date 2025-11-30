import { Offender } from '../../types';

/**
 * Mock Offenders Data
 */
export const mockOffenders: Offender[] = [
  {
    id: 'off1',
    name: 'John Doe',
    profileImage: 'https://i.pravatar.cc/150?img=1',
    totalIncidents: 5,
    lastIncidentDate: '2024-11-28T14:30:00Z',
    areaOfActivity: ['Downtown', 'Westside', 'Eastside'],
    storeTypes: ['Electronics', 'Retail', 'Department Stores'],
    notes: 'Known for concealing items in jacket',
  },
  {
    id: 'off2',
    name: 'Jane Smith',
    profileImage: 'https://i.pravatar.cc/150?img=2',
    totalIncidents: 3,
    lastIncidentDate: '2024-11-25T10:15:00Z',
    areaOfActivity: ['Westside', 'Downtown'],
    storeTypes: ['Clothing', 'Accessories'],
  },
];

