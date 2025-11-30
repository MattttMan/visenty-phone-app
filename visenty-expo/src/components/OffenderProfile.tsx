import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { Offender, Event } from '../types';
import { colors, spacing } from '../theme';
import { VideoModal } from './VideoModal';

interface OffenderProfileProps {
  offender: Offender;
  onBackPress?: () => void;
}

// Video Thumbnail Component for Offender Profile
const VideoThumbnailSmall: React.FC<{ thumbnail: string | number | undefined; videoUrl: string | number }> = ({ thumbnail, videoUrl }) => {
  const [thumbnailUri, setThumbnailUri] = useState<string>('');
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    const resolveThumbnail = async () => {
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
        if (thumbnail.match(/\.(mp4|mov|avi|webm)$/i)) {
          setThumbnailUri(thumbnail);
          setIsVideo(true);
        } else {
          setThumbnailUri(thumbnail);
          setIsVideo(false);
        }
      } else {
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
    return <View style={styles.videoThumbnail} />;
  }

  if (isVideo) {
    return (
      <Video
        source={{ uri: thumbnailUri }}
        style={styles.videoThumbnail}
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
      style={styles.videoThumbnail}
    />
  );
};

export const OffenderProfile: React.FC<OffenderProfileProps> = ({ offender, onBackPress }) => {
  const [selectedVideo, setSelectedVideo] = useState<{ url: string | number; thumbnail?: string | number } | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get all video clips from all incidents
  const allVideos = offender.allIncidents?.flatMap(incident => 
    incident.videoClips.map(clip => ({
      ...clip,
      incidentDate: incident.timestamp,
      storeName: incident.store.name,
    }))
  ) || [];

  return (
    <>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {onBackPress && (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
          {offender.profileImage ? (
            <Image
              source={{ uri: offender.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={36} color={colors.textMuted} />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{offender.name}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{offender.totalIncidents}</Text>
            <Text style={styles.statLabel}>Total Incidents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatDate(offender.lastIncidentDate)}</Text>
            <Text style={styles.statLabel}>Last Incident</Text>
          </View>
        </View>

        {/* Area of Activity */}
        {offender.areaOfActivity && offender.areaOfActivity.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Area of Activity</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScrollContent}
            >
              {offender.areaOfActivity.map((area, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{area}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Store Types */}
        {offender.storeTypes && offender.storeTypes.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Store Types Targeted</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsScrollContent}
            >
              {offender.storeTypes.map((type, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{type}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Notes */}
        {offender.notes && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionLabel}>Notes</Text>
            <Text style={styles.notesText}>{offender.notes}</Text>
          </View>
        )}

        {/* All Video Evidence */}
        {allVideos.length > 0 && (
          <View style={styles.videoSection}>
            <Text style={styles.sectionLabel}>
              Video Evidence ({allVideos.length})
            </Text>
            <View style={styles.videoList}>
              {allVideos.map((video, index) => (
                <TouchableOpacity
                  key={video.id || index}
                  style={styles.videoCard}
                  onPress={() => setSelectedVideo({ url: video.url, thumbnail: video.thumbnail })}
                  activeOpacity={0.9}
                >
                  <VideoThumbnailSmall
                    thumbnail={video.thumbnail}
                    videoUrl={video.url}
                  />
                  <View style={styles.videoContent}>
                    <View style={styles.videoHeader}>
                      <Ionicons name="play-circle" size={24} color={colors.primary} />
                      <View style={styles.videoText}>
                        <Text style={styles.videoDate}>{formatDate(video.incidentDate)}</Text>
                        <Text style={styles.videoStore}>{video.storeName}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <VideoModal
        visible={selectedVideo !== null}
        videoUrl={selectedVideo?.url || ''}
        thumbnail={selectedVideo?.thumbnail}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 0,
    padding: spacing.xl,
    overflow: 'hidden',
    width: '100%',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 18,
    marginRight: spacing.md,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: spacing.md,
  },
  profileImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    color: colors.text,
    fontWeight: '300',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  infoSection: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '300',
    marginBottom: spacing.sm,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tagsScrollContent: {
    paddingRight: spacing.xl,
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '300',
  },
  notesText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    fontWeight: '300',
  },
  videoSection: {
    marginTop: spacing.sm,
  },
  videoList: {
    gap: spacing.sm,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  videoThumbnail: {
    width: 100,
    height: 100,
    backgroundColor: colors.background,
  },
  videoContent: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'center',
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  videoDate: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '400',
    marginBottom: 2,
  },
  videoStore: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});
