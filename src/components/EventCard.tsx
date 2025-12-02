import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Event } from '../types';
import { colors, typography, spacing } from '../theme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const getEventIcon = () => {
    if (event.type === 'PAST_OFFENDER') {
      return { name: 'person-circle', color: colors.offenderAlert };
    }
    return { name: 'warning', color: colors.shopliftingAlert };
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const icon = getEventIcon();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name={icon.name} size={24} color={icon.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.summary}>{event.summary}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(event.timestamp)}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textMuted} />
      </View>

      {event.videoClips.length > 0 && (
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: event.videoClips[0].thumbnail }}
            style={styles.thumbnail}
          />
          <View style={styles.playOverlay}>
            <Icon name="play-circle" size={48} color={colors.primary} />
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.storeInfo}>
          <Icon name="location" size={14} color={colors.textSecondary} />
          <Text style={styles.storeText}>{event.store.name}</Text>
        </View>
        {event.metadata?.reviewed && (
          <View style={styles.reviewedBadge}>
            <Icon name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.reviewedText}>Reviewed</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  summary: {
    ...typography.body,
    color: colors.text,
    marginBottom: 2,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  thumbnailContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: colors.backgroundSecondary,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlayLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  reviewedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  reviewedText: {
    ...typography.caption,
    color: colors.success,
    marginLeft: 4,
  },
});



