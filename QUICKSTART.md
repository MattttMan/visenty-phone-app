# Visenty Companion - Quick Start

Get up and running in 5 minutes! ⚡

## Prerequisites

✅ Node.js 18+ installed  
✅ For iOS: macOS + Xcode 14+  
✅ For Android: Android Studio + JDK 11+

## Installation

```bash
# 1. Navigate to project
cd /Users/matthewwulff/Desktop/visenty-phone-app

# 2. Install dependencies
npm install

# 3. For iOS only:
cd ios && pod install && cd ..
```

## Run the App

### iOS
```bash
npm run ios
```

### Android
```bash
npm run android
```

## Login

Use any credentials:
- **Email**: any@email.com
- **Password**: 123456 (or any 6+ characters)

## What You'll See

1. **Login Screen** → Enter credentials
2. **Event Feed** → See 5 mock events
3. **Tap Event** → View details, videos, profiles
4. **Settings Tab** → Manage notifications

## Mock Data

The app includes:
- 5 sample events
- 2 offender profiles  
- Multiple video clips
- 3 store locations

## Next Steps

📚 Read [SETUP.md](SETUP.md) for detailed setup  
📖 See [README.md](README.md) for full documentation  
🎯 Check [FEATURES.md](FEATURES.md) for feature list

## Common Issues

**iOS build fails:**
```bash
cd ios && pod install && cd ..
```

**Android build fails:**
```bash
cd android && ./gradlew clean && cd ..
```

**Metro bundler issues:**
```bash
npm start -- --reset-cache
```

## Support

Having issues? Check [SETUP.md](SETUP.md) troubleshooting section.

---

🚀 You're ready to go! Start exploring the Visenty Companion app.

