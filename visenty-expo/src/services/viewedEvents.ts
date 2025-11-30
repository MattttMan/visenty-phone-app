import AsyncStorage from '@react-native-async-storage/async-storage';

const VIEWED_EVENTS_KEY = '@visenty:viewedEvents';

class ViewedEventsService {
  /**
   * Get all viewed event IDs
   */
  async getViewedEventIds(): Promise<Set<string>> {
    try {
      const data = await AsyncStorage.getItem(VIEWED_EVENTS_KEY);
      if (data) {
        const ids = JSON.parse(data) as string[];
        return new Set(ids);
      }
      return new Set();
    } catch (error) {
      console.error('Error getting viewed events:', error);
      return new Set();
    }
  }

  /**
   * Mark an event as viewed
   */
  async markEventAsViewed(eventId: string): Promise<void> {
    try {
      const viewedIds = await this.getViewedEventIds();
      viewedIds.add(eventId);
      await AsyncStorage.setItem(VIEWED_EVENTS_KEY, JSON.stringify(Array.from(viewedIds)));
    } catch (error) {
      console.error('Error marking event as viewed:', error);
    }
  }

  /**
   * Check if an event has been viewed
   */
  async isEventViewed(eventId: string): Promise<boolean> {
    const viewedIds = await this.getViewedEventIds();
    return viewedIds.has(eventId);
  }

  /**
   * Get count of unread events
   */
  async getUnreadCount(allEventIds: string[]): Promise<number> {
    const viewedIds = await this.getViewedEventIds();
    return allEventIds.filter(id => !viewedIds.has(id)).length;
  }

  /**
   * Clear all viewed events (for testing/reset)
   */
  async clearViewedEvents(): Promise<void> {
    try {
      await AsyncStorage.removeItem(VIEWED_EVENTS_KEY);
    } catch (error) {
      console.error('Error clearing viewed events:', error);
    }
  }
}

export default new ViewedEventsService();

