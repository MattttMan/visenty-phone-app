import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { Event } from '../types';
import { colors, typography, spacing } from '../theme';

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

// Video Thumbnail Component
const VideoThumbnail: React.FC<{ thumbnail: string | number | undefined; videoUrl: string | number }> = ({ thumbnail, videoUrl }) => {
  const [thumbnailUri, setThumbnailUri] = useState<string>('');
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    const resolveThumbnail = async () => {
      // If thumbnail is provided and is a number (local asset), resolve it
      if (thumbnail && typeof thumbnail === 'number') {
        try {
          const asset = Asset.fromModule(thumbnail);
          await asset.downloadAsync();
          setThumbnailUri(asset.localUri || asset.uri);
          setIsVideo(true);
        } catch (err) {
          console.error('Error loading thumbnail:', err);
        }
      } else if (thumbnail && typeof thumbnail === 'string') {
        // String URL - check if it's a video file
        if (thumbnail.match(/\.(mp4|mov|avi|webm)$/i)) {
          setThumbnailUri(thumbnail);
          setIsVideo(true);
        } else {
          setThumbnailUri(thumbnail);
          setIsVideo(false);
        }
      } else {
        // No thumbnail provided, use video URL
        if (typeof videoUrl === 'number') {
          try {
            const asset = Asset.fromModule(videoUrl);
            await asset.downloadAsync();
            setThumbnailUri(asset.localUri || asset.uri);
            setIsVideo(true);
          } catch (err) {
            console.error('Error loading video for thumbnail:', err);
          }
        } else if (typeof videoUrl === 'string') {
          setThumbnailUri(videoUrl);
          setIsVideo(true);
        }
      }
    };
    resolveThumbnail();
  }, [thumbnail, videoUrl]);

  if (!thumbnailUri) {
    return <View style={styles.thumbnail} />;
  }

  if (isVideo) {
    return (
      <Video
        source={{ uri: thumbnailUri }}
        style={styles.thumbnail}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isMuted={true}
        isLooping={false}
      />
    );
  }

  return (
    <Image
      source={{ uri: thumbnailUri }}
      style={styles.thumbnail}
    />
  );
};

export const EventCard: React.FC<EventCardProps> = ({ event, onPress }) => {
  const getEventIcon = () => {
    if (event.type === 'PAST_OFFENDER') {
      return { name: 'person-circle' as keyof typeof Ionicons.glyphMap, color: colors.offenderAlert };
    }
    return { name: 'warning' as keyof typeof Ionicons.glyphMap, color: colors.shopliftingAlert };
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

  // Get last incident info for past offenders
  const getLastIncidentInfo = () => {
    if (event.type === 'PAST_OFFENDER' && event.offender?.allIncidents) {
      // Find the most recent shoplifting incident
      const shopliftingIncidents = event.offender.allIncidents
        .filter(inc => inc.type === 'SHOPLIFTING')
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      if (shopliftingIncidents.length > 0) {
        const lastIncident = shopliftingIncidents[0];
        const itemCount = lastIncident.metadata?.detectedItems?.length || 0;
        return {
          date: lastIncident.timestamp,
          store: lastIncident.store.name,
          itemCount,
        };
      }
    }
    return null;
  };

  const lastIncident = getLastIncidentInfo();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: icon.color }]}>
          <Ionicons name={icon.name} size={20} color="#000" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.summary} numberOfLines={2}>{event.summary}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(event.timestamp)}</Text>
        </View>
      </View>

      {/* For past offenders, show stats instead of video */}
      {event.type === 'PAST_OFFENDER' && event.offender ? (
        <View style={styles.offenderStatsContainer}>
          <View style={styles.profileImageContainer}>
            {event.offender.profileImage ? (
              <Image
                source={{ uri: event.offender.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={32} color={colors.textMuted} />
              </View>
            )}
          </View>
          
          <View style={styles.statsContent}>
            {lastIncident ? (
              <>
                <View style={styles.statRow}>
                  <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.statText}>
                    Last theft: {new Date(lastIncident.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.statText}>{lastIncident.store}</Text>
                </View>
                <View style={styles.statRow}>
                  <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.statText}>
                    {lastIncident.itemCount} {lastIncident.itemCount === 1 ? 'item' : 'items'}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={styles.noIncidentsText}>No previous incidents</Text>
            )}
          </View>
        </View>
      ) : (
        // For shoplifting events, show video thumbnail
        event.videoClips.length > 0 && (
          <View style={styles.thumbnailContainer}>
            <VideoThumbnail
              thumbnail={event.videoClips[0].thumbnail}
              videoUrl={event.videoClips[0].url}
            />
            <View style={styles.playOverlay}>
              <Ionicons name="play-circle" size={56} color={colors.primary} />
            </View>
          </View>
        )
      )}

      <View style={styles.footer}>
        <Text style={styles.storeText}>{event.store.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    padding: 0,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  summary: {
    ...typography.body,
    color: colors.text,
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '300',
  },
  thumbnailContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '300',
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
  offenderStatsContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 16,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginRight: spacing.md,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  profileImagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary + '40',
  },
  statsContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '300',
    marginLeft: spacing.xs,
  },
  noIncidentsText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '300',
    fontStyle: 'italic',
  },
});

