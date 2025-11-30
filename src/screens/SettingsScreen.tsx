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
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '../components';
import { colors, typography, spacing } from '../theme';
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
      NotificationService.cancelAllNotifications();
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
    icon: string,
    title: string,
    subtitle: string,
    showToggle: boolean = false,
    toggleValue?: boolean,
    onToggle?: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Icon name={icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {showToggle && onToggle && (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.success }}
          thumbColor={colors.primary}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.accountCard}>
            <View style={styles.accountIcon}>
              <Icon name="person-circle" size={48} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.accountEmail}>{email}</Text>
              <Text style={styles.accountLabel}>Connected Account</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {renderSettingItem(
            'notifications',
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
            'information-circle',
            'Version',
            '1.0.0'
          )}
          {renderSettingItem(
            'shield-checkmark',
            'Privacy Policy',
            'Learn how we protect your data'
          )}
          {renderSettingItem(
            'document-text',
            'Terms of Service',
            'Review our terms and conditions'
          )}
        </View>

        <View style={styles.dangerSection}>
          <Button
            title="Disconnect Account"
            onPress={handleDisconnect}
            variant="secondary"
            style={styles.disconnectButton}
          />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountIcon: {
    marginRight: spacing.md,
  },
  accountEmail: {
    ...typography.body,
    color: colors.text,
    marginBottom: 4,
  },
  accountLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  dangerSection: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  disconnectButton: {
    borderColor: colors.accent,
  },
  footer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  footerText: {
    ...typography.h3,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.textMuted,
  },
});

