import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.configure();
  }

  configure() {
    PushNotification.configure({
      // Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        
        // Required on iOS only
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: Platform.OS === 'ios',
    });

    // Create channel for Android
    PushNotification.createChannel(
      {
        channelId: 'visenty-alerts',
        channelName: 'Visenty Alerts',
        channelDescription: 'Notifications for theft and offender alerts',
        playSound: true,
        soundName: 'default',
        importance: Importance.HIGH,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  }

  async requestPermissions() {
    if (Platform.OS === 'android') {
      return PushNotification.requestPermissions();
    }
    return true;
  }

  showLocalNotification(title: string, message: string, eventId?: string) {
    PushNotification.localNotification({
      channelId: 'visenty-alerts',
      title,
      message,
      playSound: true,
      soundName: 'default',
      importance: 'high',
      priority: 'high',
      vibrate: true,
      vibration: 300,
      userInfo: eventId ? { eventId } : undefined,
    });
  }

  showOffenderAlert(offenderName: string, storeName: string, eventId: string) {
    this.showLocalNotification(
      '🚨 Past Offender Alert',
      `${offenderName} entered ${storeName}`,
      eventId
    );
  }

  showShopliftingAlert(storeName: string, location: string, eventId: string) {
    this.showLocalNotification(
      '⚠️ Shoplifting Detected',
      `Activity detected at ${location} in ${storeName}`,
      eventId
    );
  }

  cancelAllNotifications() {
    PushNotification.cancelAllLocalNotifications();
  }
}

export default new NotificationService();



