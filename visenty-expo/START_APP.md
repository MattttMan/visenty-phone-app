# 🚀 Start Your Visenty App

## Open Your Terminal & Run This:

```bash
cd /Users/matthewwulff/Desktop/visenty-phone-app/visenty-expo
npx expo start
```

## What You'll See:

After a minute or so, you'll see:

```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

  [Large QR CODE appears here]

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
```

## 📱 To Test on Your Phone:

1. **Download Expo Go** first:
   - iPhone: App Store → Search "Expo Go"
   - Android: Play Store → Search "Expo Go"

2. **Scan the QR code** that appears in the terminal:
   - iPhone: Open Camera app → Point at QR code → Tap notification
   - Android: Open Expo Go app → Tap "Scan QR Code"

3. **Wait for app to load** (first time takes ~30 seconds)

4. **Login** with any email + password (6+ characters)

## ⚡ Quick Tips:

- **First time** takes longer (building JavaScript bundle)
- **After that** it's instant
- **Make sure** your phone and computer are on the **same WiFi**
- **If you see errors** about packages, just wait - they'll install automatically

## 🐛 Troubleshooting:

**"Port 8081 is in use"?**
```bash
lsof -ti:8081 | xargs kill -9
npx expo start
```

**QR code not appearing?**
- Wait 1-2 minutes for Metro bundler to finish
- Should see "Metro waiting on exp://..." message
- Then QR code appears below

**Phone won't connect?**
```bash
npx expo start --tunnel
```
(Tunnel works from any network but is slower)

**Need to restart?**
- Press `Ctrl+C` to stop
- Run `npx expo start` again

---

**That's it!** Open your terminal, run the command above, wait for the QR code, and scan it with your phone! 📱

