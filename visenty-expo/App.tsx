import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import NotificationService from './src/services/notifications';
import ApiService from './src/services/api';

export default function App() {
  useEffect(() => {
    // Initialize services
    ApiService.initialize();
    NotificationService.requestPermissions();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
