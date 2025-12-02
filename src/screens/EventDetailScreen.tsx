import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { VideoPlayer, OffenderProfile } from '../components';
import { Event } from '../types';
import { colors, typography, spacing } from '../theme';

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
        <Icon name="chevron-back" size={28} color={colors.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Event Details</Text>
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
        <Icon
          name={isOffender ? 'person-circle' : 'warning'}
          size={16}
          color={colors.text}
        />
        <Text style={styles.eventTypeText}>
          {isOffender ? 'Past Offender' : 'Shoplifting Detected'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.content}>
        {renderEventType()}

        <Text style={styles.summary}>{event.summary}</Text>

        <View style={styles.infoRow}>
          <Icon name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{formatTimestamp(event.timestamp)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {event.store.name} • {event.store.address}
          </Text>
        </View>

        {event.offender && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offender Profile</Text>
            <OffenderProfile offender={event.offender} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Video Evidence ({event.videoClips.length})
          </Text>
          {event.videoClips.map((clip, index) => (
            <View key={clip.id} style={styles.videoContainer}>
              <Text style={styles.videoTimestamp}>
                {formatTimestamp(clip.timestamp)}
              </Text>
              <VideoPlayer uri={clip.url} thumbnail={clip.thumbnail} />
            </View>
          ))}
        </View>

        {event.metadata?.detectedItems && (
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

        {event.metadata?.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>{event.metadata.notes}</Text>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  eventTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  eventTypeText: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  summary: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  videoContainer: {
    marginBottom: spacing.lg,
  },
  videoTimestamp: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  itemChip: {
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  notesCard: {
    backgroundColor: colors.backgroundCard,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesText: {
    ...typography.body,
    color: colors.text,
  },
});



