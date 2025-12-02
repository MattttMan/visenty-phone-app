import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing } from '../theme';
import NotificationService from '../services/notifications';
import apiService from '../services/api';

interface SettingsScreenProps {
  navigation: any;
}

interface StoreInfo {
  id: number;
  name: string;
  address?: string;
}

interface UserInfo {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [connectedStore, setConnectedStore] = useState<StoreInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [storedUserName, setStoredUserName] = useState<string | null>(null);
  const [storedStoreName, setStoredStoreName] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      // Initialize API service
      await apiService.initialize();

      // Load from AsyncStorage first (fallback)
      const storedStoreNameValue = await AsyncStorage.getItem('connectedStore');
      const storedUserNameValue = await AsyncStorage.getItem('userName');
      const storedUserEmail = await AsyncStorage.getItem('userEmail');
      const storedUserRole = await AsyncStorage.getItem('userRole');
      
      // Store in state for display
      setStoredStoreName(storedStoreNameValue);
      setStoredUserName(storedUserNameValue);

      // Set initial values from storage (always show these, even if API fails)
      if (storedStoreNameValue) {
        const storeId = await AsyncStorage.getItem('storeId');
        const storeAddress = await AsyncStorage.getItem('storeAddress');
        setConnectedStore({
          id: parseInt(storeId || '0'),
          name: storedStoreNameValue,
          address: storeAddress || undefined,
        });
      }

      if (storedUserNameValue) {
        const userId = await AsyncStorage.getItem('userId');
        setUserInfo({
          id: parseInt(userId || '0'),
          name: storedUserNameValue,
          email: storedUserEmail && storedUserEmail !== 'N/A' && storedUserEmail !== 'authorized@visenty.com' ? storedUserEmail : undefined,
          role: storedUserRole && storedUserRole !== 'N/A' ? storedUserRole : undefined,
        });
      }

      // Fetch fresh data from server
      const [storeData, userData] = await Promise.all([
        apiService.getStoreInfo(),
        apiService.getUserInfo(),
      ]);

      // Update with server data if available
      if (storeData && storeData.name) {
        setConnectedStore(storeData);
        await AsyncStorage.setItem('connectedStore', storeData.name);
        if (storeData.id) {
          await AsyncStorage.setItem('storeId', storeData.id.toString());
        }
        if (storeData.address) {
          await AsyncStorage.setItem('storeAddress', storeData.address);
        }
      }

      if (userData && userData.name) {
        setUserInfo(userData);
        await AsyncStorage.setItem('userName', userData.name);
        await AsyncStorage.setItem('userId', userData.id.toString());
        // Only store email/role if they're not "N/A"
        if (userData.email && userData.email !== 'N/A') {
          await AsyncStorage.setItem('userEmail', userData.email);
        }
        if (userData.role && userData.role !== 'N/A') {
          await AsyncStorage.setItem('userRole', userData.role);
        }
      }

      // Load notification preference
      const notifPref = await AsyncStorage.getItem('notificationsEnabled');
      if (notifPref !== null) {
        setNotificationsEnabled(notifPref === 'true');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Keep using stored values if fetch fails
    } finally {
      setLoading(false);
      setRefreshing(false);
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
            // Clear all authentication data
            await apiService.logout();
            await AsyncStorage.removeItem('isAuthenticated');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('connectedStore');
            await AsyncStorage.removeItem('storeId');
            await AsyncStorage.removeItem('accessKey');
            await AsyncStorage.removeItem('apiToken');
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
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadSettings(true)}
            tintColor={colors.primary}
          />
        }
      >
        <View style={[styles.section, styles.firstSection]}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {/* User Info Card - Always show if we have data */}
          {(userInfo || storedUserName) && (
            <View style={styles.accountCard}>
              <Ionicons name="person-outline" size={40} color={colors.primary} />
              <View style={styles.accountInfo}>
                <Text style={styles.accountStore}>
                  {userInfo?.name || storedUserName || 'Authorized User'}
                </Text>
                <Text style={styles.accountLabel}>
                  {(userInfo?.role && userInfo.role !== 'N/A') 
                    ? userInfo.role 
                    : 'Authorized User'}
                  {userInfo?.email && userInfo.email !== 'N/A' && ` • ${userInfo.email}`}
                </Text>
              </View>
            </View>
          )}

          {/* Store Info Card - Always show if we have data */}
          {(connectedStore || storedStoreName) && (
            <View style={[styles.accountCard, styles.storeCard]}>
              <Ionicons name="storefront-outline" size={40} color={colors.primary} />
              <View style={styles.accountInfo}>
                <Text style={styles.accountStore}>
                  {connectedStore?.name || storedStoreName || 'Connected Store'}
                </Text>
                <Text style={styles.accountLabel}>
                  {connectedStore?.address || 'Connected Store'}
                </Text>
              </View>
            </View>
          )}

          {/* Loading state */}
          {loading && !connectedStore && !userInfo && !storedStoreName && !storedUserName && (
            <View style={styles.accountCard}>
              <Text style={styles.loadingText}>Loading account information...</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Feed</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => navigation.navigate('LiveCameraFeed')}
            activeOpacity={0.7}
          >
            <Ionicons name="videocam-outline" size={22} color={colors.primary} style={styles.settingIcon} />
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>View Live Camera Feed</Text>
              <Text style={styles.settingSubtitle}>Watch real-time surveillance footage</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    minHeight: 44, // Match notification button height for consistent header height
    backgroundColor: colors.background,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  headerSpacer: {
    width: 44, // Match notification button width for alignment
    height: 44, // Match notification button height for consistent header height
  },
  headerTitle: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '400',
    letterSpacing: 2,
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
  firstSection: {
    paddingTop: spacing.sm,
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
  accountStore: {
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
  storeCard: {
    marginTop: spacing.sm,
  },
  loadingText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.md,
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

