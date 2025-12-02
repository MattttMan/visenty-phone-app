import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Linking,
  Alert,
  Image,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface VideoPlayerProps {
  uri: string | number; // Can be a string URL or a require() asset number
  thumbnail?: string;
  autoPlay?: boolean;
}

// Helper function to detect YouTube URLs
const isYouTubeUrl = (url: string): boolean => {
  return /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(url);
};

// Extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
};

const { width } = Dimensions.get('window');

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  thumbnail,
  autoPlay = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [videoUri, setVideoUri] = useState<string>('');
  const videoRef = useRef<Video>(null);

  // Resolve local asset URIs
  useEffect(() => {
    const resolveUri = async () => {
      setLoading(true);
      setError(false);
      
      if (typeof uri === 'number') {
        // It's a require() asset, resolve it
        try {
          const asset = Asset.fromModule(uri);
          await asset.downloadAsync();
          const resolvedUri = asset.localUri || asset.uri;
          console.log('Resolved video URI:', resolvedUri);
          if (resolvedUri) {
            setVideoUri(resolvedUri);
          } else {
            console.error('No URI resolved from asset');
            setError(true);
          }
        } catch (err) {
          console.error('Error loading video asset:', err);
          setError(true);
        } finally {
          setLoading(false);
        }
      } else {
        // It's already a string URI
        setVideoUri(uri);
        setLoading(false);
      }
    };
    resolveUri();
  }, [uri]);

  // Handle YouTube URLs
  const handleYouTubePress = async () => {
    const uriString = typeof uri === 'string' ? uri : '';
    const videoId = getYouTubeVideoId(uriString);
    if (videoId) {
      // Try to open in YouTube app first, fallback to browser
      const youtubeAppUrl = `vnd.youtube:${videoId}`;
      const youtubeWebUrl = `https://www.youtube.com/watch?v=${videoId}`;
      
      try {
        const canOpen = await Linking.canOpenURL(youtubeAppUrl);
        if (canOpen) {
          await Linking.openURL(youtubeAppUrl);
        } else {
          await Linking.openURL(youtubeWebUrl);
        }
      } catch (err) {
        Alert.alert('Error', 'Could not open YouTube video');
      }
    }
  };

  // If it's a YouTube URL, show a thumbnail that opens YouTube
  if (typeof uri === 'string' && isYouTubeUrl(uri)) {
    const videoId = getYouTubeVideoId(uri);
    const youtubeThumbnail = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.youtubeContainer}
          onPress={handleYouTubePress}
          activeOpacity={0.9}
        >
          <View style={styles.youtubeThumbnail}>
            {thumbnail ? (
              <Image source={{ uri: youtubeThumbnail }} style={styles.thumbnailImage} />
            ) : (
              <View style={styles.youtubePlaceholder}>
                <Ionicons name="logo-youtube" size={48} color={colors.accent} />
              </View>
            )}
            <View style={styles.youtubePlayOverlay}>
              <Ionicons name="play-circle" size={64} color={colors.primary} />
            </View>
            <View style={styles.youtubeLabel}>
              <Text style={styles.youtubeLabelText}>Tap to open in YouTube</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const onLoad = () => {
    setLoading(false);
  };

  const onError = () => {
    setError(true);
    setLoading(false);
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  // Don't render video until URI is resolved
  if (!videoUri) {
    return (
      <View style={styles.container}>
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: videoUri }}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay={autoPlay}
        isLooping={false}
        onLoadStart={onLoadStart}
        onLoad={onLoad}
        onError={onError}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        usePoster
        posterSource={thumbnail ? { uri: thumbnail } : undefined}
        posterStyle={styles.poster}
      />

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <View style={styles.overlay}>
          <Ionicons name="alert-circle" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>Video unavailable</Text>
        </View>
      )}

      {!loading && !error && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={64}
            color={colors.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: width * 0.6,
    backgroundColor: colors.background,
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  errorText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  youtubeContainer: {
    width: '100%',
    height: '100%',
  },
  youtubeThumbnail: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundSecondary,
  },
  youtubePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youtubePlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  youtubeLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: spacing.sm,
    alignItems: 'center',
  },
  youtubeLabelText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '300',
  },
});

