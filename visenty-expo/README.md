# Visenty Companion - Expo Version

## 🚀 Quick Start - Test on Your Phone Now!

### Step 1: Install Expo Go on Your Phone

- **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)
- **Android**: [Download from Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Step 2: Scan the QR Code

The Expo development server is now running! You should see a QR code in the terminal.

**To connect:**
- **iPhone**: Open Camera app → Point at QR code → Tap notification
- **Android**: Open Expo Go app → Tap "Scan QR code" → Point at QR code

### Step 3: Test the App!

Once the app loads on your phone:

1. **Login Screen** - Enter any email and a password (6+ characters)
   - Example: `test@visenty.com` / `password123`
   
2. **Event Feed** - Browse 5 mock security events
   - Pull down to refresh
   - Tap any event to see details
   
3. **Event Details** - View offender profiles and video evidence
   - Watch security footage
   - Review offender statistics
   
4. **Settings Tab** - Manage your account
   - Toggle notifications
   - Disconnect account

## 📱 Features

✅ **Real-time Event Monitoring** - See shoplifting and offender alerts  
✅ **Video Playback** - Watch security footage  
✅ **Offender Profiles** - View detailed criminal history  
✅ **Push Notifications** - Get alerts on your phone  
✅ **Dark Theme** - Matches Visenty brand  
✅ **Pull-to-Refresh** - Update feed in real-time  

## 🛠️ Development Commands

```bash
# Start development server
npm start

# Start with tunnel (access from any network)
npx expo start --tunnel

# Clear cache and restart
npx expo start -c

# Run on iOS simulator (Mac only)
npm run ios

# Run on Android emulator
npm run android
```

## 📖 Project Structure

```
visenty-expo/
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # App screens
│   ├── navigation/    # Navigation setup
│   ├── services/      # API & notifications
│   ├── theme/        # Design system
│   └── types/        # TypeScript types
├── App.tsx           # Root component
├── app.json          # Expo configuration
└── package.json      # Dependencies
```

## 🎨 Mock Data

The app includes realistic test data:
- 5 security events (mix of offender alerts & shoplifting)
- 2 offender profiles with photos
- 3 store locations
- Sample video clips

## 🔄 Connect to Real API

To connect to actual Visenty backend:

1. Update API endpoint in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://api.visenty.com/v1';
```

2. Replace mock data calls with real API:
```typescript
// In EventFeedScreen.tsx
const data = await ApiService.getEvents(); // Instead of getMockEvents()
```

## 📱 Building for Production

### Create Development Build
```bash
# iOS
npx expo run:ios

# Android  
npx expo run:android
```

### Create Production Build
```bash
# Configure with EAS
npx eas build:configure

# Build for iOS
npx eas build --platform ios

# Build for Android
npx eas build --platform android
```

## 🐛 Troubleshooting

**App won't load on phone:**
- Make sure phone and computer are on same WiFi
- Try tunnel mode: `npx expo start --tunnel`
- Restart Expo Go app

**"Couldn't start project" error:**
```bash
npx expo start -c  # Clear cache
```

**TypeScript errors:**
- These won't prevent the app from running
- Fix them as needed during development

## 🔔 Push Notifications

Push notifications work automatically in development with Expo Go!

For production:
1. Configure in `app.json`
2. Use Expo's push notification service
3. Or integrate with Firebase (Android) / APNs (iOS)

## 🎯 What's Different from React Native CLI Version?

- ✅ **Easier to test** - No Xcode or Android Studio needed
- ✅ **Faster development** - Hot reload, tunnel mode
- ✅ **Expo modules** - Better maintained packages
- ✅ **OTA updates** - Update app without app store
- ❌ **Slightly larger app size** - Includes Expo SDK

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Expo Go App](https://expo.dev/go)

## 🎉 You're All Set!

The app is running and ready to test. Scan the QR code with your phone and start exploring!

---

**Built for Visenty** - Ending retail theft through intelligence

