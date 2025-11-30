import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../theme';
import NotificationService from '../services/notifications';

interface SettingsScreenProps {
  navigation: any;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const userEmail = await AsyncStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value.toString());
    
    if (value) {
      await NotificationService.requestPermissions();
    } else {
      await NotificationService.cancelAllNotifications();
    }
  };

  const handleDisconnect = () => {
    Alert.alert(
      'Disconnect Account',
      'Are you sure you want to disconnect your Visenty account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('isAuthenticated');
            await AsyncStorage.removeItem('userEmail');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: keyof typeof Ionicons.glyphMap,
    title: string,
    subtitle: string,
    showToggle: boolean = false,
    toggleValue?: boolean,
    onToggle?: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <Ionicons name={icon} size={22} color={colors.primary} style={styles.settingIcon} />
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {showToggle && onToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.background}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.accountCard}>
            <Ionicons name="person-circle" size={40} color={colors.primary} />
            <View style={styles.accountInfo}>
              <Text style={styles.accountEmail}>{email}</Text>
              <Text style={styles.accountLabel}>Connected Account</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem(
            'notifications-outline',
            'Push Notifications',
            'Receive real-time alerts for events',
            true,
            notificationsEnabled,
            handleNotificationToggle
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {renderSettingItem(
            'information-circle-outline',
            'Version',
            '1.0.0'
          )}
          {renderSettingItem(
            'shield-checkmark-outline',
            'Privacy Policy',
            'Learn how we protect your data'
          )}
          {renderSettingItem(
            'document-text-outline',
            'Terms of Service',
            'Review our terms and conditions'
          )}
        </View>

        <View style={styles.dangerSection}>
          <TouchableOpacity 
            style={styles.disconnectButton}
            onPress={handleDisconnect}
            activeOpacity={0.7}
          >
            <Text style={styles.disconnectButtonText}>Disconnect Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>VISENTY</Text>
          <Text style={styles.footerSubtext}>
            Ending retail theft through intelligence
          </Text>
        </View>
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerTitle: {
    fontSize: 18,
    color: colors.primary,
    fontWeight: '300',
    letterSpacing: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: '300',
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    padding: spacing.md,
    borderRadius: 20,
  },
  accountInfo: {
    marginLeft: spacing.lg,
    flex: 1,
  },
  accountEmail: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
    marginBottom: 4,
  },
  accountLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    padding: spacing.md,
    borderRadius: 20,
    marginBottom: spacing.sm,
  },
  settingIcon: {
    marginRight: spacing.lg,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '400',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '300',
  },
  dangerSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  disconnectButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disconnectButtonText: {
    fontSize: 15,
    color: colors.accent,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
    letterSpacing: 4,
    marginBottom: spacing.xs,
    fontWeight: '300',
  },
  footerSubtext: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '300',
    letterSpacing: 1,
  },
});

