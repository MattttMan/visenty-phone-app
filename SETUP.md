# Visenty Companion - Setup Guide

This guide will help you set up the Visenty Companion app for development.

## Prerequisites Checklist

Before you begin, ensure you have the following installed:

### Required for All Platforms
- [ ] Node.js 18+ ([Download](https://nodejs.org/))
- [ ] npm or yarn
- [ ] Git

### For iOS Development
- [ ] macOS (required for iOS development)
- [ ] Xcode 14+ ([Download from App Store](https://apps.apple.com/us/app/xcode/id497799835))
- [ ] Xcode Command Line Tools
- [ ] CocoaPods (`sudo gem install cocoapods`)
- [ ] Ruby 2.6.10+

### For Android Development
- [ ] Android Studio ([Download](https://developer.android.com/studio))
- [ ] Android SDK (API 33+)
- [ ] Java Development Kit (JDK) 11+
- [ ] Android device or emulator

## Step-by-Step Setup

### 1. Verify Node.js Installation

```bash
node --version  # Should be 18.x or higher
npm --version   # Should be 9.x or higher
```

### 2. Install Dependencies

```bash
cd /Users/matthewwulff/Desktop/visenty-phone-app
npm install
```

This will install all JavaScript dependencies listed in `package.json`.

### 3. iOS Setup

#### Install Ruby Gems
```bash
bundle install
```

#### Install iOS Dependencies
```bash
cd ios
pod install
cd ..
```

If you encounter issues:
```bash
cd ios
pod repo update
pod install --repo-update
cd ..
```

#### Configure Xcode
1. Open `ios/VisentyCompanion.xcworkspace` (not .xcodeproj!)
2. Select your development team under Signing & Capabilities
3. Choose a bundle identifier (e.g., `com.yourcompany.visentycompanion`)

### 4. Android Setup

#### Set Environment Variables

Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then reload:
```bash
source ~/.zshrc
```

#### Verify Android Setup
```bash
adb devices  # Should list connected devices/emulators
```

### 5. Running the App

#### Start Metro Bundler
In one terminal:
```bash
npm start
```

#### Run on iOS
In another terminal:
```bash
npm run ios
```

Or for a specific simulator:
```bash
npx react-native run-ios --simulator="iPhone 15 Pro"
```

#### Run on Android
```bash
npm run android
```

## Troubleshooting

### iOS Issues

#### "Command PhaseScriptExecution failed"
```bash
cd ios
pod deintegrate
pod install
cd ..
```

#### "Module not found"
```bash
npx react-native start --reset-cache
```

#### Xcode build fails
1. Clean build folder: Cmd + Shift + K
2. Delete derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
3. Rebuild

### Android Issues

#### "SDK location not found"
Create `android/local.properties`:
```
sdk.dir = /Users/YOUR_USERNAME/Library/Android/sdk
```

#### Gradle build fails
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

#### "Unable to load script"
1. Check Metro is running: `npm start`
2. Clear cache: `npm start -- --reset-cache`

### General Issues

#### Port 8081 already in use
```bash
lsof -ti:8081 | xargs kill -9
npm start
```

#### Cache issues
```bash
npm start -- --reset-cache
```

Clear all caches:
```bash
rm -rf node_modules
rm -rf ios/Pods
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf android/app/build
npm install
cd ios && pod install && cd ..
```

## Development Workflow

### Hot Reload
- **iOS**: Cmd + D → Enable Hot Reloading
- **Android**: Cmd + M → Enable Hot Reloading

### Debug Menu
- **iOS Simulator**: Cmd + D
- **Android Emulator**: Cmd + M
- **Physical Device**: Shake device

### Debugging
1. Open Dev Menu
2. Select "Debug" → Opens Chrome DevTools
3. Use Console, Network, React DevTools tabs

### Running Tests
```bash
npm test
```

### Code Formatting
```bash
npm run lint
```

## Next Steps

1. ✅ Verify app launches on iOS
2. ✅ Verify app launches on Android
3. ✅ Test login with mock credentials (any email + 6+ char password)
4. ✅ Review event feed with mock data
5. ✅ Test navigation to event details
6. ✅ Configure push notifications for your development certificates
7. ✅ Connect to real Visenty API (update `src/services/api.ts`)

## Production Setup

### iOS
1. Configure signing for distribution
2. Create App Store Connect listing
3. Set up push notification certificates
4. Archive and upload to App Store

### Android
1. Generate signing keystore
2. Configure `android/app/build.gradle` with release signing
3. Create Google Play Console listing
4. Set up Firebase Cloud Messaging
5. Build release APK/AAB

## Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [iOS Developer](https://developer.apple.com/)
- [Android Developer](https://developer.android.com/)
- [Visenty Platform](https://www.visenty.com)

## Support

For setup help:
- Check the main README.md
- Contact: dev@visenty.com

Happy coding! 🚀

