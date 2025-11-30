import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Asset } from 'expo-asset';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../theme';

interface VideoModalProps {
  visible: boolean;
  videoUrl: string | number; // Can be a string URL or a require() asset number
  thumbnail?: string | number; // Can be a string URL, require() asset number, or undefined
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

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

export const VideoModal: React.FC<VideoModalProps> = ({
  visible,
  videoUrl,
  thumbnail,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [resolvedUri, setResolvedUri] = useState<string>('');
  const videoRef = useRef<Video>(null);

  // Resolve local asset URIs
  useEffect(() => {
    const resolveUri = async () => {
      if (!visible) return;
      
      setLoading(true);
      if (typeof videoUrl === 'number') {
        // It's a require() asset, resolve it
        try {
          const asset = Asset.fromModule(videoUrl);
          await asset.downloadAsync();
          const resolved = asset.localUri || asset.uri;
          if (resolved) {
            setResolvedUri(resolved);
            setLoading(false);
          } else {
            setError(true);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error loading video asset:', err);
          setError(true);
          setLoading(false);
        }
      } else {
        // It's already a string URI
        setResolvedUri(videoUrl);
        setLoading(false);
      }
    };
    resolveUri();
  }, [visible, videoUrl]);

  // Handle YouTube URLs - open in YouTube app/browser
  useEffect(() => {
    if (visible && typeof videoUrl === 'string' && isYouTubeUrl(videoUrl)) {
      const videoId = getYouTubeVideoId(videoUrl);
      if (videoId) {
        const openYouTube = async () => {
          const youtubeAppUrl = `vnd.youtube:${videoId}`;
          const youtubeWebUrl = `https://www.youtube.com/watch?v=${videoId}`;
          
          try {
            const canOpen = await Linking.canOpenURL(youtubeAppUrl);
            if (canOpen) {
              await Linking.openURL(youtubeAppUrl);
            } else {
              await Linking.openURL(youtubeWebUrl);
            }
            onClose(); // Close modal after opening YouTube
          } catch (err) {
            Alert.alert('Error', 'Could not open YouTube video');
            onClose();
          }
        };
        openYouTube();
      }
    }
  }, [visible, videoUrl]);

  // If it's a YouTube URL, don't render the video player
  if (typeof videoUrl === 'string' && isYouTubeUrl(videoUrl)) {
    return null; // Will be handled by useEffect
  }

  if (!resolvedUri && typeof videoUrl === 'number') {
    return (
      <Modal
        visible={visible}
        transparent={false}
        animationType="slide"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.videoContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </SafeAreaView>
      </Modal>
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

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: resolvedUri }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true}
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
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={72}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 22,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  video: {
    width: width,
    height: height * 0.7,
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -36 }, { translateY: -36 }],
  },
  errorText: {
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: '300',
  },
});

