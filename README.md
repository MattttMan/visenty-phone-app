# Visenty Companion

A modern, minimal React Native companion app for the Visenty retail security platform. Monitor theft events, track offenders, and receive real-time alerts directly on your iOS and Android devices.

![Visenty](https://www.visenty.com)

## 🎯 Features

- **Real-Time Event Feed** - View all security events chronologically with automatic updates
- **Past Offender Alerts** - Get instant notifications when known offenders enter your stores
- **Shoplifting Detection** - Monitor theft incidents with AI-powered detection
- **Video Evidence** - Review video clips and evidence for each event
- **Offender Profiles** - Access detailed profiles with incident history and notes
- **Push Notifications** - Receive alerts even when the app is closed
- **Multi-Store Support** - Monitor events across all your retail locations
- **Dark Mode UI** - Modern, minimal interface matching Visenty's brand aesthetic

## 📱 Screenshots

The app features:
- **Login Screen** - Secure connection to your Visenty account
- **Event Feed** - Card-based layout showing all events
- **Event Details** - Deep dive into specific incidents with video and profiles
- **Settings** - Manage notifications and account preferences

## 🏗️ Architecture

### Tech Stack

- **React Native 0.73** - Cross-platform mobile development
- **TypeScript** - Type-safe code
- **React Navigation** - Native navigation patterns
- **AsyncStorage** - Local data persistence
- **React Native Video** - Video playback
- **Vector Icons** - Ionicons icon set
- **Linear Gradient** - Modern gradient backgrounds

### Project Structure

```
visenty-phone-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── EventCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── OffenderProfile.tsx
│   ├── screens/            # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── EventFeedScreen.tsx
│   │   ├── EventDetailScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/         # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── services/           # API & services
│   │   ├── api.ts
│   │   ├── notifications.ts
│   │   └── mockData.ts
│   ├── theme/             # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   └── App.tsx            # Root component
├── ios/                   # iOS native code
├── android/              # Android native code
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn**
- **Xcode** 14+ (for iOS development)
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS dependencies)
- **Ruby** 2.6.10 or higher

### Installation

1. **Clone the repository**
```bash
cd /Users/matthewwulff/Desktop/visenty-phone-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Install iOS dependencies**
```bash
cd ios
bundle install
pod install
cd ..
```

### Running the App

#### iOS

```bash
npm run ios
# or
npx react-native run-ios
```

To run on a specific device:
```bash
npx react-native run-ios --device "iPhone Name"
```

#### Android

1. Start an Android emulator or connect a device
2. Run:
```bash
npm run android
# or
npx react-native run-android
```

### Development Mode

Start the Metro bundler:
```bash
npm start
# or
npx react-native start
```

## 🎨 Design System

The app uses a custom design system based on Visenty's brand:

### Colors
- **Background**: `#0A0A0A` (Deep black)
- **Cards**: `#1A1A1A` (Dark gray)
- **Text**: `#FFFFFF` (White)
- **Accent**: `#FF3B30` (Alert red)
- **Success**: `#34C759` (Green)

### Typography
- **Headings**: Bold, -0.5 letter spacing
- **Body**: Regular, 16px, 24px line height
- **Captions**: 12px for metadata

### Spacing
- Uses 8px grid system
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px

## 🔌 API Integration

The app is designed to connect to the Visenty API. Currently uses mock data for development.

### Configuring the API

Edit `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://api.visenty.com/v1';
```

### API Endpoints

- `POST /auth/login` - User authentication
- `GET /events` - Fetch events
- `GET /events/:id` - Get event details
- `PATCH /events/:id` - Mark event as reviewed
- `GET /user/me` - Get current user

## 🔔 Push Notifications

### iOS Setup

1. Enable Push Notifications in Xcode
2. Configure Apple Push Notification service (APNs)
3. Add push notification entitlements

### Android Setup

1. Configure Firebase Cloud Messaging (FCM)
2. Add `google-services.json` to `android/app/`
3. Update build.gradle with Firebase dependencies

## 🧪 Testing

### Mock Data

The app includes mock data for development:
- 5 sample events (offender alerts & shoplifting)
- 2 mock offenders with profiles
- Sample video clips and thumbnails

Replace mock data calls with real API calls in production.

## 📦 Building for Production

### iOS

```bash
cd ios
xcodebuild -workspace VisentyCompanion.xcworkspace -scheme VisentyCompanion -configuration Release
```

Or use Xcode:
1. Open `ios/VisentyCompanion.xcworkspace`
2. Select Product > Archive
3. Distribute to App Store

### Android

```bash
cd android
./gradlew assembleRelease
```

APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

## 🔐 Security

- All API calls require authentication tokens
- Tokens stored securely in AsyncStorage
- HTTPS required for all network requests
- Sensitive data never logged in production

## 🤝 Contributing

This is a proprietary app for Visenty. For internal development:

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

## 📄 License

Proprietary - © 2024 Visenty. All rights reserved.

## 🆘 Troubleshooting

### iOS Issues

**Pod install fails:**
```bash
cd ios
pod repo update
pod install --repo-update
```

**Build fails:**
- Clean build folder: Product > Clean Build Folder in Xcode
- Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`

### Android Issues

**Gradle sync fails:**
```bash
cd android
./gradlew clean
```

**Metro bundler issues:**
```bash
npx react-native start --reset-cache
```

### Common Issues

**White screen on launch:**
- Check Metro bundler is running
- Verify bundle is loaded: `npm start`

**Push notifications not working:**
- Check permissions in device settings
- Verify notification service is initialized

## 📞 Support

For technical support or questions:
- Email: support@visenty.com
- Website: https://www.visenty.com
- Documentation: Internal wiki

## 🗺️ Roadmap

- [ ] Biometric authentication (Face ID / Fingerprint)
- [ ] Offline mode with sync
- [ ] Advanced filtering and search
- [ ] Export reports and evidence
- [ ] Multi-language support
- [ ] iPad optimization
- [ ] Heat map analytics view
- [ ] Gate system controls

---

Built with ❤️ for Visenty - Ending retail theft through intelligence
