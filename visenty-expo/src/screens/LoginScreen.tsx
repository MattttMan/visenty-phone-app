import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';

interface LoginScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');
const SCAN_AREA_SIZE = Math.min(width * 0.75, height * 0.4);

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [showHelp, setShowHelp] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanningEnabled, setScanningEnabled] = useState(false);

  // Clear authentication when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const clearAuth = async () => {
        try {
          await AsyncStorage.removeItem('isAuthenticated');
          await AsyncStorage.removeItem('userEmail');
          await AsyncStorage.removeItem('userName');
          await AsyncStorage.removeItem('connectedStore');
          await AsyncStorage.removeItem('storeId');
          await AsyncStorage.removeItem('accessKey');
          await AsyncStorage.removeItem('server_base_url');
          await AsyncStorage.removeItem('apiToken');
          setScanned(false);
          setScanningEnabled(false);
        } catch (error) {
          console.error('Failed to clear auth:', error);
        }
      };
      clearAuth();
    }, [])
  );

  useEffect(() => {
    // Request camera permission on mount
    if (!permission?.granted) {
      requestPermission();
    }
    // Enable scanning after a short delay to prevent accidental scans
    const timer = setTimeout(() => {
      setScanningEnabled(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !scanningEnabled) return;
    
    // Validate QR code data format
    if (!data || data.trim().length === 0) {
      return;
    }
    
    // Prevent multiple scans of the same QR code
    setScanned(true);
    setScanningEnabled(false);
    
    try {
      // Check if QR code is in the access key URL format: http://server:port/access/[access_key]
      const accessUrlMatch = data.match(/^https?:\/\/[^\/]+\/access\/.+$/);
      
      if (accessUrlMatch) {
        // New format: Validate access key with server
        try {
          const { user, accessKey } = await apiService.validateAccessKey(data);
          
          // Store authentication info
          await AsyncStorage.setItem('isAuthenticated', 'true');
          await AsyncStorage.setItem('userEmail', user.email || user.name || 'authorized@visenty.com');
          await AsyncStorage.setItem('userName', user.name || 'Authorized User');
          await AsyncStorage.setItem('accessKey', accessKey);
          await AsyncStorage.setItem('apiToken', accessKey);
          
          // Store user ID if available
          if (user.id) {
            await AsyncStorage.setItem('userId', user.id);
          }
          
          // Store store info if available
          if (user.stores && user.stores.length > 0) {
            await AsyncStorage.setItem('connectedStore', user.stores[0].name);
            await AsyncStorage.setItem('storeId', user.stores[0].id);
            if (user.stores[0].address) {
              await AsyncStorage.setItem('storeAddress', user.stores[0].address);
            }
          } else {
            await AsyncStorage.setItem('connectedStore', 'Connected Store');
          }
          
          navigation.replace('Main');
        } catch (error: any) {
          setScanned(false);
          
          if (error.message === 'ACCESS_DEACTIVATED') {
            Alert.alert(
              'Access Deactivated',
              'Your access has been deactivated. Please contact your administrator.',
              [
                { 
                  text: 'OK', 
                  onPress: () => {
                    setTimeout(() => {
                      setScanned(false);
                      setScanningEnabled(true);
                    }, 500);
                  }
                }
              ]
            );
          } else if (error.message === 'ACCESS_DENIED') {
            Alert.alert(
              'Access Denied',
              'Invalid QR code. Please scan a valid QR code from the Visenty software.',
              [
                { 
                  text: 'OK', 
                  onPress: () => {
                    setTimeout(() => {
                      setScanned(false);
                      setScanningEnabled(true);
                    }, 500);
                  }
                }
              ]
            );
          } else {
            // Parse error message to show helpful information
            let errorTitle = 'Connection Error';
            let errorMessage = error.message || 'Failed to validate QR code. Please check your internet connection and try again.';
            
            // Provide more specific error messages
            if (error.message?.includes('INVALID_SERVER_ADDRESS')) {
              errorTitle = 'Invalid Server Address';
              errorMessage = 'The QR code contains an invalid server address.\n\n❌ Problem:\nThe QR code uses "0.0.0.0", "localhost", or "127.0.0.1" which only work on the server computer itself, not on mobile devices.\n\n✅ Solution:\n1. On the server computer, find the actual IP address:\n   • Mac/Linux: Run "ifconfig" or "ipconfig getifaddr en0"\n   • Windows: Run "ipconfig"\n   • Look for your local IP (e.g., 192.168.1.100)\n\n2. Regenerate the QR code using the actual IP address:\n   • Set PUBLIC_SERVER_URL="http://YOUR_IP:5001"\n   • Or use: "http://YOUR_IP:5001" instead of "0.0.0.0"\n\n3. Make sure your phone is on the same WiFi network as the server.';
            } else if (error.message?.includes('CONNECTION_REFUSED')) {
              errorTitle = 'Cannot Connect to Server';
              errorMessage = 'The server is not reachable. Please ensure:\n\n• The surveillance server is running\n• Your phone is on the same network (for local servers)\n• The server URL in the QR code is correct';
            } else if (error.message?.includes('CONNECTION_TIMEOUT')) {
              errorTitle = 'Connection Timeout';
              errorMessage = 'The server did not respond. Please check:\n\n• Your internet connection\n• The server is running and accessible\n• Firewall settings are not blocking the connection';
            } else if (error.message?.includes('NETWORK_ERROR') || error.message?.includes('NO_INTERNET')) {
              errorTitle = 'Network Error';
              errorMessage = 'Cannot connect to the internet. Please:\n\n• Check your WiFi or mobile data connection\n• Ensure you have internet access\n• Try again once connected';
            } else if (error.message?.includes('not found') || error.message?.includes('ENOTFOUND')) {
              errorTitle = 'Invalid Server Address';
              errorMessage = 'The server address in the QR code could not be found. Please:\n\n• Verify the QR code is from the correct server\n• Check if the server URL is correct\n• Contact your administrator for a new QR code';
            } else if (error.message?.includes('Server error')) {
              errorTitle = 'Server Error';
              errorMessage = error.message;
            }
            
            Alert.alert(
              errorTitle,
              errorMessage,
              [
                { 
                  text: 'OK', 
                  onPress: () => {
                    // Re-enable scanning after user dismisses the alert
                    setTimeout(() => {
                      setScanned(false);
                      setScanningEnabled(true);
                    }, 500);
                  }
                }
              ]
            );
          }
        }
      } else {
        // Legacy format: visenty://connect?store=... (for backward compatibility)
        let storeName = 'Store #12 - Downtown';
        let userEmail = 'connected@visenty.com';
        
        if (data.includes('visenty://') || data.includes('store=')) {
          const storeMatch = data.match(/store=([^&]+)/);
          if (storeMatch) {
            storeName = decodeURIComponent(storeMatch[1]);
          }
        }
        
        // Store authentication and navigate (legacy mode)
        await AsyncStorage.setItem('isAuthenticated', 'true');
        await AsyncStorage.setItem('userEmail', userEmail);
        await AsyncStorage.setItem('connectedStore', storeName);
        navigation.replace('Main');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to connect. Please try again.');
      setScanned(false);
    }
  };

  const handleBypass = async () => {
    try {
      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('userEmail', 'demo@visenty.com');
      await AsyncStorage.setItem('connectedStore', 'Store #12 - Downtown');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to bypass. Please try again.');
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={[colors.background, colors.backgroundSecondary]}
        style={styles.container}
      >
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color={colors.primary} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need access to your camera to scan the QR code.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.backgroundSecondary]}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>VISENTY</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.cameraSection}>
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanned || !scanningEnabled ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            >
              <View style={styles.overlay}>
                <View style={styles.scanArea}>
                  {/* Corner brackets */}
                  <View style={styles.cornerTopLeft} />
                  <View style={styles.cornerTopRight} />
                  <View style={styles.cornerBottomLeft} />
                  <View style={styles.cornerBottomRight} />
                </View>
              </View>
            </CameraView>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.scanText}>Scan QR Code</Text>
          <Text style={styles.instructionText}>
            Point your camera at the QR code displayed in the Visenty software
          </Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.bypassButton}
              onPress={handleBypass}
              activeOpacity={0.7}
            >
              <Text style={styles.bypassButtonText}>Skip</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.helpButtonFooter}
              onPress={() => setShowHelp(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.helpButtonText}>Where to find it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Help Modal */}
      <Modal
        visible={showHelp}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Where to find the QR code</Text>
              <TouchableOpacity
                onPress={() => setShowHelp(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                1. Open the Visenty surveillance software on your computer{'\n\n'}
                2. Go to Store Management page{'\n\n'}
                3. Add an authorized person or view existing person's QR code{'\n\n'}
                4. Point your phone camera at the QR code displayed on your screen{'\n\n'}
                5. The QR code contains an access URL that will connect you to the system
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl + spacing.md,
    paddingBottom: spacing.lg,
  },
  logo: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    letterSpacing: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  cameraSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: SCAN_AREA_SIZE + 40,
  },
  cameraContainer: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.primary + '40',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: SCAN_AREA_SIZE * 0.85,
    height: SCAN_AREA_SIZE * 0.85,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderColor: colors.primary,
    borderTopLeftRadius: 12,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 50,
    height: 50,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: colors.primary,
    borderTopRightRadius: 12,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderColor: colors.primary,
    borderBottomLeftRadius: 12,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 50,
    height: 50,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderColor: colors.primary,
    borderBottomRightRadius: 12,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  scanText: {
    ...typography.h3,
    color: colors.text,
    fontSize: 22,
    fontWeight: '500',
    marginBottom: spacing.sm,
  },
  instructionText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
  },
  bypassButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundCard,
    minWidth: 140,
  },
  bypassButtonText: {
    ...typography.body,
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  helpButtonFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  helpButtonText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  permissionText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  permissionButtonText: {
    ...typography.button,
    color: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    width: width * 0.85,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  modalBody: {
    padding: spacing.lg,
  },
  modalText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
