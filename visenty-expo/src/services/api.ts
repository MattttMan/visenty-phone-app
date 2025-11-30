import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, User, AuthCredentials } from '../types';

// Replace with actual Visenty API endpoint
const API_BASE_URL = 'https://api.visenty.com/v1';

class ApiService {
  private token: string | null = null;

  async initialize() {
    this.token = await AsyncStorage.getItem('auth_token');
  }

  async login(credentials: AuthCredentials): Promise<User> {
    try {
      // This is a mock implementation. Replace with actual API call
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      this.token = response.data.token;
      await AsyncStorage.setItem('auth_token', this.token!);
      return response.data.user;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async logout() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  async getEvents(limit: number = 50): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${this.token}` },
        params: { limit },
      });
      return response.data.events;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch event:', error);
      throw error;
    }
  }

  async markEventAsReviewed(eventId: string): Promise<void> {
    try {
      await axios.patch(
        `${API_BASE_URL}/events/${eventId}`,
        { reviewed: true },
        { headers: { Authorization: `Bearer ${this.token}` } }
      );
    } catch (error) {
      console.error('Failed to mark event as reviewed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) {
      return null;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

export default new ApiService();

