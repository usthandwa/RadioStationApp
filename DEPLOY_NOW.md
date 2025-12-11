# Deploy to App Stores - Quick Guide

Fast track to getting your app in the App Store and Google Play.

---

## ⚠️ CRITICAL: Update API URL First!

**Current (Local Development):**
```json
"apiUrl": "http://192.168.0.188:3001/api"
```

**Must Change To:**
```json
"apiUrl": "https://YOUR-PRODUCTION-API.com/api"
```

Edit `app.json` line 45 with your production API URL.

---

## Required Before You Start

### Accounts Needed

1. **Apple Developer** ($99/year)
   - Sign up: https://developer.apple.com/programs/
   - Use your Apple ID
   - Takes 24-48 hours to activate

2. **Google Play Console** ($25 one-time)
   - Sign up: https://play.google.com/console/signup
   - Use your Google account
   - Instant activation

### Tools Check

```bash
# Verify EAS CLI
npx eas-cli whoami

# If not logged in
npx eas-cli login
```

---

## Deployment Process (Simple)

### Step 1: Update Configuration

**Edit app.json:**
```json
{
  "expo": {
    "version": "1.0.0",  // Keep or increment
    "extra": {
      "apiUrl": "https://YOUR-PRODUCTION-API/api"  // ← CHANGE THIS!
    }
  }
}
```

### Step 2: Run Deployment Script

```bash
./deploy.sh
```

**Select option 6:** Full deployment (build + submit both)

### Step 3: Wait

- Builds take ~15-20 minutes
- Check progress: https://expo.dev/accounts/szama/projects/awrsidmedia/builds

### Step 4: Configure Store Listings

#### Apple App Store Connect
https://appstoreconnect.apple.com

1. Go to your app
2. Add screenshots (required)
3. Fill in description
4. Add privacy policy URL
5. Submit for review

#### Google Play Console
https://play.google.com/console

1. Go to your app
2. Add screenshots (min 2)
3. Fill in description
4. Create feature graphic (1024x500)
5. Complete content rating
6. Add privacy policy URL
7. Submit for review

### Step 5: Wait for Approval

- **iOS**: 24-48 hours
- **Android**: 1-7 days

---

## Alternative: Manual Deployment

### iOS

```bash
# Build
npx eas-cli build --platform ios --profile production

# Submit
npx eas-cli submit --platform ios --latest
```

### Android

```bash
# Build
npx eas-cli build --platform android --profile production

# Submit
npx eas-cli submit --platform android --latest
```

### Both

```bash
# Build both
npx eas-cli build --platform all --profile production

# Submit both
npx eas-cli submit --platform ios --latest
npx eas-cli submit --platform android --latest
```

---

## Screenshots (Required)

### How to Create

**Option 1: Use Simulators**
```bash
# iOS
npx expo run:ios
# Take screenshots in simulator

# Android
npx expo run:android
# Take screenshots in emulator
```

**Option 2: Use Online Tools**
- Figma: https://www.figma.com
- Canva: https://www.canva.com
- Screenshot.rocks: https://screenshot.rocks

### Required Sizes

**iOS (minimum 2 per size):**
- iPhone 6.7": 1290 x 2796
- iPhone 6.5": 1242 x 2688
- iPad Pro: 2048 x 2732

**Android (minimum 2):**
- Phone: 1080 x 1920 (or similar)
- Tablet: Optional

---

## Privacy Policy (Required)

You must have a privacy policy URL for both stores.

**Quick Option: Use Generator**
- https://www.privacypolicygenerator.info
- https://www.freeprivacypolicy.com

**Host It:**
- On your website
- GitHub Pages
- Or any public URL

**Must Cover:**
- What data you collect
- How you use it
- Third-party services
- Contact info

---

## Costs Summary

### To Launch (Required)

- Apple Developer: **$99/year**
- Google Play: **$25 one-time**
- **Total: $124**

### Optional

- EAS Build: Free tier or $29/month
- Production API hosting: Varies
- Domain name: $10-20/year

---

## Complete Checklist

Before running `./deploy.sh`:

- [ ] Production API is live
- [ ] API URL updated in app.json
- [ ] Apple Developer account active
- [ ] Google Play Console account active
- [ ] App tested on both platforms
- [ ] Screenshots prepared
- [ ] Privacy policy URL ready
- [ ] App description written

---

## Quick Deploy (Copy-Paste)

```bash
# 1. Update app.json with production API URL
# Edit: "apiUrl": "https://your-api.com/api"

# 2. Run deployment
./deploy.sh

# 3. Select option 6

# 4. Wait for builds

# 5. Configure store listings
# iOS: https://appstoreconnect.apple.com
# Android: https://play.google.com/console

# 6. Submit for review

# 7. Wait for approval (1-2 days)
```

---

## After Approval

Your app will be live at:

**App Store:**
```
https://apps.apple.com/app/awrsidmedia/[ID]
```

**Play Store:**
```
https://play.google.com/store/apps/details?id=com.szama.awrsidmedia
```

Share these links on:
- Your website
- Social media
- Email newsletter
- Marketing materials

---

## Need More Details?

See complete guides:
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Comprehensive walkthrough
- [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md) - Full checklist

---

## Troubleshooting

### "API URL is local"
- Update `app.json` line 45 with production URL

### "Build failed"
- Check logs: `npx eas-cli build:list`
- Review error message
- Try clearing cache: `--clear-cache` flag

### "Submission failed"
- For iOS: Check Apple ID credentials
- For Android: Verify service account setup
- Review rejection reason
- Fix and resubmit

### "App rejected"
- Read rejection carefully
- Fix issues mentioned
- Common: missing privacy policy, crashes, incomplete info
- Resubmit with explanation

---

## Getting Help

- **EAS Issues**: https://docs.expo.dev/eas/
- **App Store**: https://developer.apple.com/support/
- **Play Store**: https://support.google.com/googleplay/android-developer/

---

## Status Check

**Current Configuration:**
- ⚠️  API URL: `http://192.168.0.188:3001/api` (LOCAL - MUST CHANGE)
- ✅ App Version: `1.0.0`
- ✅ Bundle IDs: Configured
- ✅ Assets: Present
- ⚠️  Store Accounts: Need setup

**Next Step:**
1. Set up production API
2. Update `app.json` with production URL
3. Run `./deploy.sh`
4. Select option 6

**Time to Launch: ~2-4 hours of your time + 1-7 days review**

Ready? Run `./deploy.sh` and select option 6! 🚀
