import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { VideoPlayer, OffenderProfile, PotentialOffenderBar } from '../components';
import { Event } from '../types';
import { colors, typography, spacing } from '../theme';
import { getOffenderIncidents } from '../services/mockData';
import viewedEventsService from '../services/viewedEvents';

interface EventDetailScreenProps {
  route: {
    params: {
      event: Event;
    };
  };
  navigation: any;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { event } = route.params;

  // Mark event as viewed when screen opens
  React.useEffect(() => {
    viewedEventsService.markEventAsViewed(event.id);
  }, [event.id]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={28} color={colors.primary} />
      </TouchableOpacity>
      <View style={styles.placeholder} />
    </View>
  );

  const renderEventType = () => {
    const isOffender = event.type === 'PAST_OFFENDER';
    return (
      <View
        style={[
          styles.eventTypeBadge,
          { backgroundColor: isOffender ? colors.offenderAlert : colors.shopliftingAlert },
        ]}
      >
        <Ionicons
          name={isOffender ? 'person-circle' : 'warning'}
          size={14}
          color="#000"
        />
        <Text style={styles.eventTypeText}>
          {isOffender ? 'Past Offender' : 'Shoplifting Detected'}
        </Text>
      </View>
    );
  };

  // If offender profile, show full-width profile without header
  if (event.offender) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.profileContent} showsVerticalScrollIndicator={false}>
          <OffenderProfile 
            offender={event.offender} 
            onBackPress={() => navigation.goBack()}
          />
        </ScrollView>
      </View>
    );
  }

  // For non-offender events, show normal detail view
  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderEventType()}

        <Text style={styles.summary}>{event.summary}</Text>

        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>{formatTimestamp(event.timestamp)}</Text>
          <View style={styles.dot} />
          <Text style={styles.metaText}>{event.store.name}</Text>
        </View>

        {/* Potential Offender Match Bar */}
        {event.metadata?.potentialOffender && (
          <View style={styles.section}>
            <PotentialOffenderBar
              offender={event.metadata.potentialOffender}
              matchConfidence={event.metadata.matchConfidence}
              onPress={() => {
                // Get all incidents for this offender
                const allIncidents = getOffenderIncidents(event.metadata!.potentialOffender!.id);
                
                // Navigate to offender profile with full incident history
                navigation.push('EventDetail', {
                  event: {
                    id: `offender-${event.metadata.potentialOffender!.id}`,
                    type: 'PAST_OFFENDER',
                    timestamp: event.timestamp,
                    store: event.store,
                    summary: `Past Offender: ${event.metadata.potentialOffender!.name} entered ${event.store.name}`,
                    offender: {
                      ...event.metadata.potentialOffender,
                      allIncidents: allIncidents,
                    },
                    videoClips: allIncidents.length > 0 ? allIncidents[0].videoClips : [],
                  },
                });
              }}
            />
          </View>
        )}

        {event.videoClips.length > 0 && (
          <View style={styles.section}>
            {event.videoClips.map((clip, index) => (
              <View key={clip.id} style={styles.videoContainer}>
                <VideoPlayer uri={clip.url} thumbnail={clip.thumbnail} />
              </View>
            ))}
          </View>
        )}

        {event.metadata?.detectedItems && event.metadata.detectedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detected Items</Text>
            <View style={styles.itemsContainer}>
              {event.metadata.detectedItems.map((item, index) => (
                <View key={index} style={styles.itemChip}>
                  <Text style={styles.itemText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  profileContent: {
    flex: 1,
  },
  eventTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  eventTypeText: {
    color: '#000',
    fontWeight: '400',
    marginLeft: spacing.xs,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  summary: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '400',
    marginBottom: spacing.sm,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.textMuted,
    marginHorizontal: spacing.xs,
  },
  section: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '300',
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  videoContainer: {
    marginBottom: spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  itemChip: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemText: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '300',
  },
});

