import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventCard } from '../components';
import { Event } from '../types';
import { colors, typography, spacing } from '../theme';
import { getMockEvents } from '../services/mockData';
import viewedEventsService from '../services/viewedEvents';

interface EventFeedScreenProps {
  navigation: any;
}

export const EventFeedScreen: React.FC<EventFeedScreenProps> = ({ navigation }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewedEventIds, setViewedEventIds] = useState<Set<string>>(new Set());

  const fetchEvents = async () => {
    try {
      // Use mock data for development
      // In production, replace with: await ApiService.getEvents()
      const data = await getMockEvents();
      setEvents(data);
      
      // Load viewed events
      const viewed = await viewedEventsService.getViewedEventIds();
      setViewedEventIds(viewed);
      
      // Update unread count
      const eventIds = data.map(e => e.id);
      const unread = eventIds.filter(id => !viewed.has(id)).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    // Listen for focus events to update unread count when returning to screen
    const unsubscribe = navigation.addListener('focus', () => {
      fetchEvents();
    });
    
    return unsubscribe;
  }, [navigation]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  const handleEventPress = async (event: Event) => {
    // Mark event as viewed
    await viewedEventsService.markEventAsViewed(event.id);
    
    // Update local state
    const newViewed = new Set(viewedEventIds);
    newViewed.add(event.id);
    setViewedEventIds(newViewed);
    
    // Update unread count
    const unread = events.filter(e => !newViewed.has(e.id)).length;
    setUnreadCount(unread);
    
    navigation.navigate('EventDetail', { event });
  };

  const handleNotificationPress = () => {
    setShowNotifications(true);
  };

  const handleNotificationItemPress = async (event: Event) => {
    await handleEventPress(event);
    setShowNotifications(false);
  };



  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No events yet</Text>
      <Text style={styles.emptySubtext}>
        New alerts will appear here in real-time
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>VISENTY</Text>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>VISENTY</Text>
        <TouchableOpacity 
          style={styles.notificationButton} 
          activeOpacity={0.7}
          onPress={handleNotificationPress}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.primary} />
          {unreadCount > 0 && (
            <View style={styles.notificationDot}>
              <Text style={styles.notificationCount}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard event={item} onPress={() => handleEventPress(item)} />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      {/* Notifications Dropdown */}
      {showNotifications && (
        <>
          <TouchableOpacity
            style={styles.dropdownOverlay}
            activeOpacity={1}
            onPress={() => setShowNotifications(false)}
          />
          <View style={styles.notificationsDropdown}>
            {/* Arrow pointing up */}
            <View style={styles.dropdownArrow} />
            <View style={styles.dropdownArrowInner} />
            
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Notifications</Text>
              {unreadCount > 0 && (
                <View style={styles.dropdownBadge}>
                  <Text style={styles.dropdownBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            
            <FlatList
              data={events}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isUnread = !viewedEventIds.has(item.id);
                return (
                  <TouchableOpacity
                    style={[
                      styles.notificationItem,
                      isUnread && styles.notificationItemUnread,
                    ]}
                    onPress={() => handleNotificationItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationItemContent}>
                      <Text style={styles.notificationItemText} numberOfLines={2}>
                        {item.summary}
                      </Text>
                      <Text style={styles.notificationItemTime}>
                        {new Date(item.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                    {isUnread && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyNotifications}>
                  <Text style={styles.emptyNotificationsText}>No new notifications</Text>
                </View>
              }
              style={styles.dropdownList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingTop: spacing.xl,
  },
  listContent: {
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    zIndex: 10,
  },
  logo: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '300',
    letterSpacing: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.accent,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.background,
  },
  notificationCount: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl * 2,
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 998,
  },
  notificationsDropdown: {
    position: 'absolute',
    top: 80,
    right: spacing.xl,
    width: 340,
    maxHeight: 500,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  dropdownArrow: {
    position: 'absolute',
    top: -9,
    right: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: -1,
  },
  dropdownArrowInner: {
    position: 'absolute',
    top: -8,
    right: 21,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.backgroundCard,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  dropdownBadge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  dropdownBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '700',
  },
  dropdownList: {
    maxHeight: 400,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  notificationItemUnread: {
    backgroundColor: colors.backgroundSecondary + '40',
  },
  notificationItemContent: {
    flex: 1,
  },
  notificationItemText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '400',
    marginBottom: 4,
  },
  notificationItemTime: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.md,
  },
  emptyNotifications: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyNotificationsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});

