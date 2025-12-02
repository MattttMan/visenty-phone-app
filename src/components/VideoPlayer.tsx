import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing } from '../theme';

interface VideoPlayerProps {
  uri: string;
  thumbnail?: string;
  autoPlay?: boolean;
}

const { width } = Dimensions.get('window');

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  uri,
  thumbnail,
  autoPlay = false,
}) => {
  const [paused, setPaused] = useState(!autoPlay);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef<Video>(null);

  const handlePlayPause = () => {
    setPaused(!paused);
  };

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri }}
        style={styles.video}
        paused={paused}
        resizeMode="contain"
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        poster={thumbnail}
        posterResizeMode="cover"
      />

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && (
        <View style={styles.overlay}>
          <Icon name="alert-circle" size={48} color={colors.textSecondary} />
          <Text style={styles.errorText}>Video unavailable</Text>
        </View>
      )}

      {!loading && !error && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPause}
          activeOpacity={0.8}
        >
          <Icon
            name={paused ? 'play' : 'pause'}
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
  },
  video: {
    width: '100%',
    height: '100%',
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
});



