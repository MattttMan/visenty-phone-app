import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Offender } from '../types';
import { colors, spacing } from '../theme';

interface PotentialOffenderBarProps {
  offender: Offender;
  matchConfidence?: number;
  onPress: () => void;
}

export const PotentialOffenderBar: React.FC<PotentialOffenderBarProps> = ({
  offender,
  matchConfidence,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="scan" size={20} color={colors.primary} />
        </View>
        
        <View style={styles.profileSection}>
          {offender.profileImage ? (
            <Image
              source={{ uri: offender.profileImage }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={20} color={colors.textMuted} />
            </View>
          )}
          
          <View style={styles.info}>
            <View style={styles.headerRow}>
              <Text style={styles.label}>Potential Match</Text>
              {matchConfidence !== undefined && (
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{matchConfidence}%</Text>
                </View>
              )}
            </View>
            <Text style={styles.name}>{offender.name}</Text>
            <Text style={styles.stats}>
              {offender.totalIncidents} incidents • Last: {new Date(offender.lastIncidentDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary + '40', // 40 = 25% opacity in hex
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  profileSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '400',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginRight: spacing.sm,
  },
  confidenceBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 9,
    color: colors.primary,
    fontWeight: '400',
  },
  name: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '400',
    marginBottom: 2,
  },
  stats: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '300',
  },
});

