# 📱 How to Test Your Visenty App

## ⚠️ SDK Version Issue

Your Expo Go app is **SDK 54**, but this project uses **SDK 52**. Here are your options:

---

## ✅ **Option 1: Use Android Phone (EASIEST)**

If you have an Android phone, the SDK mismatch might not be an issue:

1. **Install Expo Go** from Google Play Store
2. **Open Expo Go app**
3. **Tap "Scan QR Code"**
4. **Scan the QR code** from your terminal
5. App should load! 🎉

---

## ✅ **Option 2: Use iOS Simulator (If you have Xcode)**

1. **In the terminal where Expo is running**, press **`i`**
2. This will open iOS Simulator
3. App loads automatically!
4. No need to scan QR code

---

## ✅ **Option 3: Downgrade Expo Go on iPhone**

Unfortunately, **you can't downgrade Expo Go on physical iOS devices** - only the latest version is supported by Apple.

So if you're using **iPhone**, you must use **Option 2 (Simulator)**.

---

## 🎯 **Current Status**

The Expo server is running and building. Once it finishes (about 1-2 minutes), you'll see:

```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go
```

Then you can:
- **Android phone**: Scan and test
- **iPhone**: Press `i` in terminal to use simulator
- **Any computer**: Press `w` to test in web browser

---

## 🚀 **What You'll Be Able to Test**

Once running:

### Login Screen
- Email: `test@visenty.com`
- Password: `password123`
- (Or any email + 6+ character password)

### Event Feed  
- See 5 mock security events
- Pull down to refresh
- Tap events to see details

### Event Details
- Watch security videos
- View offender profiles
- See incident information

### Settings
- Toggle notifications
- Logout

---

## 💡 **Quick Commands**

Once Expo is running, press in the terminal:

- **`i`** → Open iOS Simulator
- **`a`** → Open Android Emulator  
- **`w`** → Open in web browser
- **`r`** → Reload app
- **`?`** → Show all commands

---

## 🔧 **If You Want to Test on iPhone (Physical Device)**

You'd need to:
1. Upgrade the project to SDK 54 (complex, many dependencies)
2. OR create a development build (requires paid Apple Developer account)
3. OR use iOS Simulator instead (easiest!)

---

## ✨ **Recommended: Use iOS Simulator**

Since you're on a Mac, this is the **easiest option**:

1. Wait for Metro bundler to finish (terminal will show QR code)
2. Press **`i`** in that terminal
3. iOS Simulator opens with your app!
4. Test everything just like on a real phone

---

**The server is currently rebuilding the cache. This will take about 1-2 minutes. Once you see the QR code, choose your option above!**



