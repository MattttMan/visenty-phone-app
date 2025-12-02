import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';
import apiService from '../services/api';

interface LiveCameraFeedScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

export const LiveCameraFeedScreen: React.FC<LiveCameraFeedScreenProps> = ({ navigation }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [imageKey, setImageKey] = useState(0); // Force re-render for refresh
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadVideoStream();
    return () => {
      // Cleanup interval on unmount
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Set up auto-refresh for MJPEG stream
    if (videoUrl && isPlaying) {
      // Clear any existing interval first
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      // Refresh every 300ms for ~3fps - MJPEG streams don't "complete" so we refresh regardless
      // Start refreshing after a short delay to let the first image attempt
      const timeoutId = setTimeout(() => {
        refreshIntervalRef.current = setInterval(() => {
          setImageKey(prev => prev + 1);
        }, 300);
        console.log('[Live Feed] Started refresh interval (300ms)');
      }, 1000); // Wait 1 second before starting refresh

      return () => {
        clearTimeout(timeoutId);
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    } else {
      // Clear interval when paused
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
        console.log('[Live Feed] Stopped refresh interval');
      }
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [videoUrl, isPlaying]);

  const loadVideoStream = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize API service first
      await apiService.initialize();

      // Try to get main video feed URL first (preferred for MJPEG)
      let streamUrl = await apiService.getMainVideoFeedUrl();
      
      // If that fails, try the camera stream URL
      if (!streamUrl) {
        streamUrl = await apiService.getVideoStreamUrl(0);
      }

      console.log('[Live Feed] Stream URL:', streamUrl);

      if (streamUrl) {
        setVideoUrl(streamUrl);
        // Don't set loading to false immediately - wait for image to load
      } else {
        setError('Unable to load camera feed. Please check your connection.');
        setLoading(false);
      }
    } catch (err: any) {
      console.error('Error loading video stream:', err);
      setError('Failed to load camera feed. Please try again.');
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRefresh = () => {
    setImageKey(prev => prev + 1);
    loadVideoStream();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Live Camera Feed</Text>
        <TouchableOpacity
          onPress={handleRefresh}
          style={styles.refreshButton}
        >
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Video Container */}
      <View style={styles.videoContainer}>
        {loading && !videoUrl && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading camera feed...</Text>
          </View>
        )}

        {error && (
          <View style={styles.overlay}>
            <Ionicons name="alert-circle" size={64} color={colors.accent} />
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorSubtext}>
              {videoUrl ? `URL: ${videoUrl.substring(0, 50)}...` : 'No URL available'}
            </Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {videoUrl && !error && (
          <View style={styles.imageWrapper}>
              <Image
                key={`feed-${imageKey}`}
                source={{ 
                  uri: `${videoUrl}${videoUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`, // Add timestamp to prevent caching
                }}
                style={styles.video}
                resizeMode="cover"
                onLoadStart={() => {
                  if (imageKey === 0 || imageKey % 10 === 0) {
                    console.log('[Live Feed] Image load started, frame:', imageKey);
                  }
                  // Only show loading on first load
                  if (imageKey === 0) {
                    setLoading(true);
                  }
                }}
                onLoad={(event) => {
                  // Hide loading when image loads
                  setLoading(false);
                  const { width, height } = event.nativeEvent.source || {};
                  if (imageKey === 0 || imageKey % 10 === 0) {
                    console.log('[Live Feed] ✅ Image loaded successfully, frame:', imageKey, 'size:', width || 'unknown', 'x', height || 'unknown');
                  }
                }}
                onError={(error) => {
                  const errorMsg = error.nativeEvent?.error || error?.message || 'Unknown error';
                  console.error('[Live Feed] ❌ Image load error, frame:', imageKey, 'error:', errorMsg);
                  // Only show error on first few load attempts
                  if (imageKey < 5) {
                    setError(`Failed to load camera feed: ${errorMsg}. Please check your connection.`);
                    setLoading(false);
                  }
                }}
                onLoadEnd={() => {
                  // Ensure loading is false after load ends
                  setLoading(false);
                }}
              />

            {!loading && videoUrl && (
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={handlePlayPause}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isPlaying ? 'pause-circle' : 'play-circle'}
                  size={72}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {!videoUrl && !loading && !error && (
          <View style={styles.overlay}>
            <Ionicons name="videocam-off-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.errorText}>No camera feed available</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Info Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {isPlaying ? 'Live' : 'Paused'} • Tap to {isPlaying ? 'pause' : 'play'}
        </Text>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    padding: spacing.sm,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    minWidth: width,
    minHeight: height * 0.7,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  errorSubtext: {
    marginTop: spacing.sm,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  retryButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 24,
  },
  retryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -36 }, { translateY: -36 }],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 36,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
