import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, User, AuthCredentials } from '../types';

// Default API endpoint (fallback if no server URL from QR code)
const DEFAULT_API_BASE_URL = 'https://api.visenty.com/v1';

class ApiService {
  private token: string | null = null;
  private serverBaseUrl: string | null = null;

  /**
   * Get the base URL for API calls
   * Uses server URL from QR code if available, otherwise uses default
   */
  private getBaseUrl(): string {
    if (this.serverBaseUrl) {
      return this.serverBaseUrl;
    }
    return DEFAULT_API_BASE_URL;
  }

  async initialize() {
    this.token = await AsyncStorage.getItem('auth_token');
    this.serverBaseUrl = await AsyncStorage.getItem('server_base_url');
  }

  async login(credentials: AuthCredentials): Promise<User> {
    try {
      // This is a mock implementation. Replace with actual API call
      const response = await axios.post(`${this.getBaseUrl()}/auth/login`, credentials);
      this.token = response.data.token;
      await AsyncStorage.setItem('auth_token', this.token!);
      return response.data.user;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  }

  async logout() {
    this.token = null;
    this.serverBaseUrl = null;
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('server_base_url');
    await AsyncStorage.removeItem('accessKey');
  }

  /**
   * Get live camera feed URL
   * @param cameraId - Optional camera ID (defaults to 0 for main feed)
   * @returns Video stream URL with access key authentication
   */
  async getVideoStreamUrl(cameraId: number = 0): Promise<string | null> {
    try {
      await this.initialize();
      const accessKey = await AsyncStorage.getItem('accessKey');
      const baseUrl = this.getBaseUrl();

      if (!accessKey || !baseUrl) {
        return null;
      }

      // Return video stream URL with access key
      return `${baseUrl}/api/camera/stream/${cameraId}?access_key=${accessKey}`;
    } catch (error) {
      console.error('Failed to get video stream URL:', error);
      return null;
    }
  }

  /**
   * Get main video feed URL (alternative endpoint)
   * @returns Video feed URL with access key authentication
   */
  async getMainVideoFeedUrl(): Promise<string | null> {
    try {
      await this.initialize();
      const accessKey = await AsyncStorage.getItem('accessKey');
      const baseUrl = this.getBaseUrl();

      if (!accessKey || !baseUrl) {
        return null;
      }

      // Return main video feed URL with access key
      return `${baseUrl}/video_feed?access_key=${accessKey}`;
    } catch (error) {
      console.error('Failed to get main video feed URL:', error);
      return null;
    }
  }

  async getEvents(limit: number = 50): Promise<Event[]> {
    try {
      const response = await axios.get(`${this.getBaseUrl()}/events`, {
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
      const response = await axios.get(`${this.getBaseUrl()}/events/${eventId}`, {
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
        `${this.getBaseUrl()}/events/${eventId}`,
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
      const response = await axios.get(`${this.getBaseUrl()}/user/me`, {
        headers: { Authorization: `Bearer ${this.token}` },
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get store information from surveillance server
   * Uses access key authentication
   */
  async getStoreInfo(): Promise<{ id: number; name: string; address?: string } | null> {
    try {
      await this.initialize();
      const accessKey = await AsyncStorage.getItem('accessKey');
      const baseUrl = this.getBaseUrl();

      if (!accessKey || !baseUrl) {
        return null;
      }

      // Try JSON API endpoint
      try {
        const response = await axios.get(`${baseUrl}/api/store/info`, {
          params: { access_key: accessKey },
          validateStatus: (status) => status < 500,
        });

        if (response.status === 200) {
          const storeData = response.data || {};
          // Handle "N/A" values
          return {
            id: storeData.id || 0,
            name: storeData.name && storeData.name !== 'N/A' ? storeData.name : 'Connected Store',
            address: storeData.address && storeData.address !== 'N/A' ? storeData.address : undefined,
          };
        }
      } catch (error: any) {
        // If endpoint doesn't exist, return null (will use stored data)
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch store info:', error);
      return null;
    }
  }

  /**
   * Get user/person information from surveillance server
   * Uses access key authentication
   */
  async getUserInfo(): Promise<{
    id: number;
    name: string;
    email?: string;
    role?: string;
  } | null> {
    try {
      await this.initialize();
      const accessKey = await AsyncStorage.getItem('accessKey');
      const baseUrl = this.getBaseUrl();

      if (!accessKey || !baseUrl) {
        return null;
      }

      // Try JSON API endpoint for validating access and getting user info
      try {
        const response = await axios.get(`${baseUrl}/api/validate_access`, {
          params: { access_key: accessKey },
          validateStatus: (status) => status < 500,
        });

        if (response.status === 200 && response.data.success) {
          const personData = response.data.person || {};
          // Handle "N/A" values
          return {
            id: personData.id || 0,
            name: personData.name && personData.name !== 'N/A' ? personData.name : 'Authorized User',
            email: personData.email && personData.email !== 'N/A' ? personData.email : undefined,
            role: personData.role && personData.role !== 'N/A' ? personData.role : undefined,
          };
        }
      } catch (error: any) {
        // If endpoint doesn't exist, return null (will use stored data)
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      return null;
    }
  }

  /**
   * Validate access key from QR code
   * QR code URL format: http://your-server:5000/access/[access_key]
   * 
   * @param accessUrl - Full URL from QR code (e.g., http://server:5000/access/xK9mP3nQ...)
   * @returns User info if valid and active, throws error otherwise
   */
  async validateAccessKey(accessUrl: string): Promise<{ user: User; accessKey: string }> {
    try {
      // Extract base URL and access key from the QR code URL
      const urlMatch = accessUrl.match(/^(https?:\/\/[^\/]+)\/access\/(.+)$/);
      if (!urlMatch) {
        throw new Error('Invalid QR code format. Expected: http://server:port/access/[access_key]');
      }

      let [, baseUrl, accessKey] = urlMatch;
      
      // Check for invalid server addresses that won't work on mobile devices
      if (baseUrl.includes('0.0.0.0') || baseUrl.includes('127.0.0.1') || baseUrl.includes('localhost')) {
        throw new Error('INVALID_SERVER_ADDRESS: The QR code contains an invalid server address (0.0.0.0, localhost, or 127.0.0.1). These addresses only work on the server machine itself. Please regenerate the QR code with the actual server IP address or domain name.');
      }
      
      // Store server base URL for subsequent API calls
      this.serverBaseUrl = baseUrl;
      await AsyncStorage.setItem('server_base_url', baseUrl);
      
      // Try /api/validate_access endpoint first (preferred - returns person and store info)
      try {
        console.log(`[QR Validation] Attempting to validate access key at: ${baseUrl}/api/validate_access`);
        const validateResponse = await axios.get(`${baseUrl}/api/validate_access`, {
          params: { access_key: accessKey },
          validateStatus: (status) => status < 500,
          timeout: 10000, // 10 second timeout
        });
        console.log(`[QR Validation] Response status: ${validateResponse.status}`);

        if (validateResponse.status === 200 && validateResponse.data.success) {
          // Valid and active - extract person and store data
          const personData = validateResponse.data.person || {};
          const storeData = validateResponse.data.store || {};
          
          // Handle "N/A" values - convert to empty string or undefined
          const personEmail = personData.email && personData.email !== 'N/A' ? personData.email : '';
          const personName = personData.name && personData.name !== 'N/A' ? personData.name : 'Authorized User';
          const storeName = storeData.name && storeData.name !== 'N/A' ? storeData.name : 'Connected Store';
          
          return {
            user: {
              id: personData.id?.toString() || '',
              email: personEmail,
              name: personName,
              apiToken: accessKey,
              stores: storeData.id ? [{
                id: storeData.id.toString(),
                name: storeName,
                address: storeData.address && storeData.address !== 'N/A' ? storeData.address : '',
              }] : [],
            },
            accessKey,
          };
        } else if (validateResponse.status === 403 || (validateResponse.data && !validateResponse.data.success)) {
          // Valid but inactive or access denied
          console.log('[QR Validation] Access deactivated');
          throw new Error('ACCESS_DEACTIVATED');
        } else if (validateResponse.status === 401) {
          console.log('[QR Validation] Access denied');
          throw new Error('ACCESS_DENIED');
        }
      } catch (validateError: any) {
        console.log(`[QR Validation] Error on /api/validate_access:`, validateError.code || validateError.message);
        // If validate_access endpoint doesn't exist, try /api/access/[key] endpoint
        if (validateError.response?.status === 404 || validateError.code === 'ERR_BAD_REQUEST' || validateError.code === 'ECONNABORTED') {
          try {
            console.log(`[QR Validation] Trying fallback endpoint: ${baseUrl}/api/access/${accessKey.substring(0, 10)}...`);
            const response = await axios.get(`${baseUrl}/api/access/${accessKey}`, {
              validateStatus: (status) => status < 500,
              timeout: 10000, // 10 second timeout
            });

            if (response.status === 200) {
              // Valid and active
              const userData = response.data.user || response.data;
              return {
                user: {
                  id: userData.id || userData.person_id?.toString() || '',
                  email: userData.email || userData.name || '',
                  name: userData.name || userData.email || 'Authorized User',
                  apiToken: accessKey,
                  stores: userData.stores || [],
                },
                accessKey,
              };
            } else if (response.status === 403) {
              throw new Error('ACCESS_DEACTIVATED');
            } else if (response.status === 401) {
              throw new Error('ACCESS_DENIED');
            }
          } catch (apiError: any) {
            // If API endpoint doesn't exist, try HTML endpoint
            if (apiError.response?.status === 404 || apiError.code === 'ERR_BAD_REQUEST' || apiError.code === 'ECONNABORTED') {
              // Fallback to HTML endpoint
              console.log(`[QR Validation] Trying HTML endpoint: ${baseUrl}/access/${accessKey.substring(0, 10)}...`);
              const htmlResponse = await axios.get(`${baseUrl}/access/${accessKey}`, {
                validateStatus: (status) => status < 500,
                timeout: 10000, // 10 second timeout
              });

              if (htmlResponse.status === 200) {
                // Valid and active - parse HTML or use access key as token
                return {
                  user: {
                    id: '',
                    email: '',
                    name: 'Authorized User',
                    apiToken: accessKey,
                    stores: [],
                  },
                  accessKey,
                };
              } else if (htmlResponse.status === 403) {
                throw new Error('ACCESS_DEACTIVATED');
              } else if (htmlResponse.status === 401) {
                throw new Error('ACCESS_DENIED');
              }
            } else {
              // Re-throw if it's a different error
              if (apiError.message === 'ACCESS_DEACTIVATED' || apiError.message === 'ACCESS_DENIED') {
                throw apiError;
              }
              throw new Error('Failed to validate access key. Please check your connection.');
            }
          }
        } else {
          // Re-throw if it's a different error
          if (validateError.message === 'ACCESS_DEACTIVATED' || validateError.message === 'ACCESS_DENIED') {
            throw validateError;
          }
          throw new Error('Failed to validate access key. Please check your connection.');
        }
      }

      throw new Error('Unexpected response from server');
    } catch (error: any) {
      // Handle specific error types
      if (error.message === 'ACCESS_DEACTIVATED' || error.message === 'ACCESS_DENIED') {
        throw error;
      }
      
      // Handle server response errors
      if (error.response) {
        if (error.response.status === 403) {
          throw new Error('ACCESS_DEACTIVATED');
        } else if (error.response.status === 401) {
          throw new Error('ACCESS_DENIED');
        }
        // Other HTTP errors
        throw new Error(`Server error: ${error.response.status} - ${error.response.statusText || 'Unknown error'}`);
      }
      
      // Handle network errors
      // Only log error details once (not repeatedly)
      if (error.code && !error._logged) {
        console.error('[QR Validation] Error:', error.code, error.message);
        error._logged = true;
      }
      if (error.code) {
        switch (error.code) {
          case 'ECONNREFUSED':
            throw new Error('CONNECTION_REFUSED: Cannot connect to server. Make sure the server is running and accessible.');
          case 'ETIMEDOUT':
          case 'ECONNABORTED':
            throw new Error('CONNECTION_TIMEOUT: Server did not respond in time. Check your network connection.');
          case 'ENOTFOUND':
            throw new Error('CONNECTION_ERROR: Server address not found. Check the QR code URL.');
          case 'ERR_NETWORK':
            throw new Error('NETWORK_ERROR: Network request failed. Check your internet connection.');
          case 'ERR_INTERNET_DISCONNECTED':
            throw new Error('NO_INTERNET: No internet connection. Please connect to WiFi or mobile data.');
          default:
            throw new Error(`CONNECTION_ERROR: ${error.code} - ${error.message || 'Failed to connect to server'}`);
        }
      }
      
      // Handle request errors without specific codes
      if (error.message) {
        // Check if it's a known error message
        if (error.message.includes('Network Error') || error.message.includes('network')) {
          throw new Error('NETWORK_ERROR: Cannot reach server. Check your internet connection and server URL.');
        }
        if (error.message.includes('timeout')) {
          throw new Error('CONNECTION_TIMEOUT: Server did not respond. Check if server is running.');
        }
        // Re-throw the original error message if it's informative
        throw new Error(error.message);
      }
      
      // Generic fallback
      throw new Error('CONNECTION_ERROR: Failed to validate access key. Please check your connection and try again.');
    }
  }
}

export default new ApiService();

