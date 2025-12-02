import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './navigation/AppNavigator';
import NotificationService from './services/notifications';
import ApiService from './services/api';
import { colors } from './theme';

const App = () => {
  useEffect(() => {
    // Initialize services
    ApiService.initialize();
    NotificationService.requestPermissions();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;



