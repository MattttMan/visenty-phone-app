# ✨ Test Your Visenty App Right Now!

## The app is LIVE and ready to test! 🚀

### 📱 Step 1: Get Expo Go on Your Phone

**iPhone:**
1. Open App Store
2. Search "Expo Go"
3. Download & install

**Android:**
1. Open Google Play Store
2. Search "Expo Go"  
3. Download & install

### 📷 Step 2: Scan the QR Code

**Look at your terminal** - you should see a QR code!

**iPhone Users:**
1. Open your Camera app (not Expo Go!)
2. Point it at the QR code in the terminal
3. Tap the notification that pops up
4. App will open in Expo Go automatically!

**Android Users:**
1. Open the Expo Go app
2. Tap "Scan QR code"
3. Point camera at the QR code in terminal
4. App will load!

### 🎮 Step 3: Test the App!

Once loaded, try these features:

#### Login Screen
- **Email**: Type anything like `test@visenty.com`
- **Password**: Type any 6+ characters like `password123`
- Tap "Connect"

#### Event Feed
- See 5 mock security events
- **Pull down** to refresh
- **Tap any event** to see details

#### Event Details
- View video footage (tap play button)
- See offender profiles
- Review incident details
- Tap back arrow to return

#### Settings Tab
- Toggle notifications on/off
- View account info
- Tap "Disconnect" to logout

## 🎨 What You're Seeing

- **Dark Theme** - Matching Visenty's website
- **Real-time Updates** - Pull to refresh
- **Mock Data** - 5 sample events for testing
- **Video Playback** - Sample security footage
- **Offender Profiles** - Criminal history tracking

## 📱 Features to Test

✅ Login with any credentials  
✅ Browse event feed  
✅ View event details  
✅ Play video clips  
✅ See offender profiles  
✅ Navigate between tabs  
✅ Toggle notifications  
✅ Logout and login again  

## 🐛 Having Issues?

**Can't see QR code?**
- Look in the terminal where you ran the command
- It should show a large QR code
- May need to scroll up

**Phone won't connect?**
- Make sure phone & computer are on same WiFi
- If still issues, the tunnel mode should work from any network

**App crashed?**
- Shake your phone
- Tap "Reload"

**Need to restart?**
```bash
# Stop: Press Ctrl+C in terminal
# Restart:
cd /Users/matthewwulff/Desktop/visenty-phone-app/visenty-expo
npx expo start --tunnel
```

## 🎯 Test Scenarios

### Scenario 1: Offender Alert
1. Go to Event Feed
2. Tap "Past Offender: John Doe entered store #12"
3. View offender profile with stats
4. Play video evidence
5. Go back

### Scenario 2: Shoplifting Incident
1. Tap a "Shoplifting detected" event
2. View detected items
3. Play security footage
4. Check location details

### Scenario 3: Settings
1. Tap Settings tab
2. Toggle notifications
3. Review account info
4. Disconnect (logs you out)
5. Login again!

## 📊 Mock Data Includes

- **5 Events**: Mix of offender alerts & shoplifting
- **2 Offenders**: John Doe & Jane Smith with profiles
- **3 Stores**: Different locations
- **Multiple Videos**: Sample security footage
- **Realistic Times**: Recent timestamps

## 🚀 What's Next?

Once you've tested:

1. **Connect Real API** - Update `src/services/api.ts`
2. **Replace Mock Data** - Use actual Visenty backend
3. **Configure Push** - Set up real notifications
4. **Build Production** - Create standalone app

## 📝 Feedback?

As you test, note:
- What works well? ✅
- Any bugs? 🐛  
- Feature requests? 💡
- UI/UX feedback? 🎨

---

**Enjoy testing your Visenty Companion app!** 🎉

The app runs with full functionality on your phone right now. Test all the features and see your retail security platform come to life!



