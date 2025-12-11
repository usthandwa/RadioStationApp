# App Store Deployment Guide

Complete guide to deploy AWR SID Media to Google Play Store and Apple App Store.

---

## Pre-Deployment Checklist

### 1. Update API URL
⚠️ **CRITICAL**: Change from local development API to production API

**Current (Development):**
```json
"apiUrl": "http://192.168.0.188:3001/api"
```

**Update to Production API URL:**
- Replace with your production CMS API URL
- Example: `"apiUrl": "https://api.awrsidmedia.com/api"`

### 2. Update App Version
Edit `app.json`:
```json
"version": "1.0.0"  // Increment for each release
```

### 3. Required Assets
✅ Verify all assets are ready:
- `./assets/icon.png` - 1024x1024px app icon
- `./assets/splash.png` - Splash screen
- `./assets/adaptive-icon.png` - Android adaptive icon
- All presenter images in correct format

### 4. Store Listings Ready
Prepare for both stores:
- App description (short & full)
- Screenshots (multiple device sizes)
- Privacy policy URL
- Keywords/tags
- Feature graphics (Google Play)
- App preview videos (optional)

---

## Step 1: Configure Production Environment

### Update app.json

Edit `app.json` to add store-specific metadata:

```json
{
  "expo": {
    "name": "AWR SID Media",
    "slug": "awrsidmedia",
    "version": "1.0.0",
    "description": "Listen to AWR SID Media live broadcasts, podcasts, and more",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.szama.awrsidmediaIOS",
      "buildNumber": "1",
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    },
    "android": {
      "package": "com.szama.awrsidmedia",
      "versionCode": 1,
      "permissions": ["AUDIO_RECORDING"],
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "extra": {
      "apiUrl": "YOUR_PRODUCTION_API_URL_HERE"
    }
  }
}
```

### Update eas.json for Production

Current configuration is good, but you can enhance:

```json
{
  "cli": {
    "version": ">= 12.5.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_API_URL": "YOUR_PRODUCTION_API_URL"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "YOUR_APPLE_ID@email.com",
        "ascAppId": "YOUR_APP_STORE_CONNECT_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-service-account.json",
        "track": "internal"
      }
    }
  }
}
```

---

## Step 2: Build Production Apps

### Build for iOS

```bash
# Build for App Store
npx eas-cli build --platform ios --profile production

# Follow prompts:
# 1. Log in with Apple Developer account
# 2. Confirm App Store Connect setup
# 3. Wait for build (~15-20 minutes)
```

**What you'll get:**
- IPA file for App Store distribution
- Build URL on EAS dashboard

### Build for Android

```bash
# Build AAB for Google Play
npx eas-cli build --platform android --profile production

# Options:
# - Android App Bundle (AAB) - Recommended for Play Store
# - APK - For direct distribution
```

**What you'll get:**
- AAB file for Google Play Store
- Build URL on EAS dashboard

### Build Both Platforms

```bash
# Build both at once
npx eas-cli build --platform all --profile production
```

---

## Step 3: Submit to Apple App Store

### Option A: Automatic Submission (Recommended)

```bash
# Submit iOS build to App Store Connect
npx eas-cli submit --platform ios --latest

# Follow prompts:
# 1. Select the build
# 2. Enter Apple ID
# 3. Provide app-specific password
# 4. Confirm submission
```

### Option B: Manual Submission

1. **Download IPA** from EAS build page
2. **Open Transporter app** (Mac)
3. **Upload IPA** to App Store Connect
4. **Configure in App Store Connect**:
   - Go to https://appstoreconnect.apple.com
   - Select your app
   - Add screenshots (required sizes)
   - Set app description
   - Set privacy policy URL
   - Submit for review

### App Store Connect Configuration

**Required Information:**
- **Category**: Music or Entertainment
- **Content Rights**: Radio/Podcast streaming
- **Privacy Policy URL**: Your privacy policy
- **Support URL**: Support website
- **Marketing URL**: (optional)

**Screenshots Required (per device):**
- iPhone 6.7" (iPhone 14 Pro Max)
- iPhone 6.5" (iPhone 11 Pro Max)
- iPhone 5.5" (iPhone 8 Plus)
- iPad Pro 12.9" (6th gen)
- iPad Pro 12.9" (2nd gen)

**App Preview Video:** (optional but recommended)

---

## Step 4: Submit to Google Play Store

### Option A: Automatic Submission (Recommended)

#### Setup Service Account

1. **Create Service Account**:
   - Go to [Google Play Console](https://play.google.com/console)
   - Settings → API access
   - Create service account
   - Grant permissions: "Release apps to testing tracks"

2. **Download JSON key**:
   - Save as `google-play-service-account.json`
   - Place in project root
   - Add to `.gitignore`

3. **Submit**:
```bash
# Submit to internal testing
npx eas-cli submit --platform android --latest

# Or specify track
npx eas-cli submit --platform android --track internal
```

### Option B: Manual Submission

1. **Download AAB** from EAS build page
2. **Go to Google Play Console**: https://play.google.com/console
3. **Create new app** (if first time)
4. **Upload AAB**:
   - Production → Releases → Create new release
   - Upload AAB file
   - Set release name
   - Add release notes

### Google Play Console Configuration

**Required Information:**
- **App name**: AWR SID Media
- **Short description**: (80 characters max)
- **Full description**: (4000 characters max)
- **App category**: Music & Audio
- **Content rating**: Submit questionnaire
- **Privacy policy URL**: Required
- **Contact details**: Email, phone, website

**Graphics Assets Required:**
- **Icon**: 512x512px (already have)
- **Feature Graphic**: 1024x500px
- **Phone Screenshots**: 2-8 images
- **Tablet Screenshots**: (optional)
- **TV Screenshots**: (if applicable)

**Release Tracks:**
- **Internal**: Testing (up to 100 testers)
- **Closed**: Limited testing
- **Open**: Public testing
- **Production**: Live in store

---

## Step 5: Testing Tracks

### iOS TestFlight

After App Store Connect upload:

```bash
# Build is automatically available in TestFlight
# Add testers in App Store Connect

# External Testing:
# - Up to 10,000 testers
# - Requires Apple review
# - Share public link

# Internal Testing:
# - Up to 100 testers (team members)
# - No review needed
# - Instant access
```

### Android Internal Testing

```bash
# Submit to internal track
npx eas-cli submit --platform android --track internal

# Add testers in Play Console:
# - Create tester list
# - Add email addresses
# - Share opt-in URL
```

---

## Complete Deployment Commands

### For First Release (Both Stores)

```bash
# 1. Update production API URL in app.json
# Edit app.json: "apiUrl": "https://your-production-api.com/api"

# 2. Build production apps
npx eas-cli build --platform all --profile production

# 3. Wait for builds to complete (~20 minutes)
# Check status: npx eas-cli build:list

# 4. Submit iOS to App Store
npx eas-cli submit --platform ios --latest

# 5. Submit Android to Play Store
npx eas-cli submit --platform android --latest

# 6. Configure store listings manually (one-time setup)
# - App Store Connect: https://appstoreconnect.apple.com
# - Google Play Console: https://play.google.com/console

# 7. Submit for review
```

### For Updates (Version 1.0.1+)

```bash
# 1. Update version in app.json
# "version": "1.0.1"

# 2. Update release notes
# Create RELEASE_NOTES.md

# 3. Build and submit
npx eas-cli build --platform all --profile production
npx eas-cli submit --platform ios --latest
npx eas-cli submit --platform android --latest
```

---

## Deployment Checklist

### Pre-Build
- [ ] Update API URL to production
- [ ] Update app version number
- [ ] Test app thoroughly on both platforms
- [ ] Verify all assets are present
- [ ] Check bundle identifiers are correct
- [ ] Review and test payment features (if any)

### iOS Specific
- [ ] Apple Developer account enrolled ($99/year)
- [ ] App Store Connect app created
- [ ] Certificates and provisioning profiles ready
- [ ] Screenshots prepared (all required sizes)
- [ ] Privacy policy URL ready
- [ ] App description written
- [ ] Keywords selected

### Android Specific
- [ ] Google Play Console account ($25 one-time)
- [ ] App listing created
- [ ] Service account configured (for EAS submit)
- [ ] Screenshots prepared (at least 2)
- [ ] Feature graphic created (1024x500)
- [ ] Content rating questionnaire completed
- [ ] Privacy policy URL ready

### Post-Submission
- [ ] Monitor build status on EAS dashboard
- [ ] Check for review feedback
- [ ] Respond to review questions promptly
- [ ] Test app from stores after approval
- [ ] Update marketing materials with store links

---

## Review Timeline

### Apple App Store
- **First review**: 24-48 hours (typically)
- **Updates**: 12-24 hours
- **Rejections**: Common reasons:
  - Incomplete information
  - Bugs or crashes
  - Privacy policy issues
  - Content violations

### Google Play Store
- **First review**: 1-7 days
- **Updates**: 1-3 days
- **Rejections**: Common reasons:
  - Content rating issues
  - Privacy policy missing
  - App crashes
  - Permissions not justified

---

## Cost Breakdown

### Development & Build
- **EAS Build**: Free (limited builds) or $29/month (unlimited)
- **EAS Submit**: Included with build plan

### Store Registration
- **Apple Developer**: $99/year (required)
- **Google Play Console**: $25 one-time fee

### Optional Services
- **Custom domain**: $10-20/year
- **Backend hosting**: Varies (for production API)
- **Push notifications**: Free (Expo) or custom service

**Total to Launch:**
- Minimum: $124 (Apple + Google)
- With EAS: $29/month (optional but recommended)

---

## Troubleshooting

### Build Fails

```bash
# Check build logs
npx eas-cli build:list
# Click on build ID to see logs

# Clear cache and retry
npx eas-cli build --platform ios --profile production --clear-cache
```

### Submission Fails

**iOS:**
- Check Apple ID credentials
- Verify App Store Connect app exists
- Check bundle identifier matches
- Review build logs for warnings

**Android:**
- Verify service account permissions
- Check AAB format is correct
- Ensure version code is incremented
- Review submission track

### App Rejected

**Respond quickly:**
- Read rejection reason carefully
- Fix issues mentioned
- Resubmit with explanation
- Add notes for reviewers if needed

---

## Production API Requirements

Before deploying, ensure your production API:

### Must Have
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS configured for app domains
- [ ] Rate limiting implemented
- [ ] Error handling robust
- [ ] Logging and monitoring setup
- [ ] Database backups configured

### API Endpoints
Ensure all endpoints work in production:
```
GET  /api/health
GET  /api/presenters
GET  /api/shows
GET  /api/live-stream-info
POST /api/presenters (admin)
PUT  /api/presenters/:name (admin)
DELETE /api/presenters/:name (admin)
```

### Update app.json
```json
{
  "extra": {
    "apiUrl": "https://api.yourdomain.com/api"
  }
}
```

---

## Quick Reference Commands

```bash
# Check EAS authentication
npx eas-cli whoami

# Build production
npx eas-cli build --platform all --profile production

# Check build status
npx eas-cli build:list

# Submit to stores
npx eas-cli submit --platform ios --latest
npx eas-cli submit --platform android --latest

# View project
npx eas-cli project:info

# Update credentials
npx eas-cli credentials

# Build locally (faster, requires Xcode/Android Studio)
npx expo run:ios --configuration Release
npx expo run:android --variant release
```

---

## Store URLs After Launch

Once approved, your app will be available at:

**Apple App Store:**
```
https://apps.apple.com/app/awrsidmedia/[APP_ID]
```

**Google Play Store:**
```
https://play.google.com/store/apps/details?id=com.szama.awrsidmedia
```

---

## Next Steps After Launch

1. **Monitor Analytics**
   - Install tracking (Firebase, Amplitude, etc.)
   - Monitor crashes (Sentry, Bugsnag)
   - Track user engagement

2. **Marketing**
   - Update website with store badges
   - Social media announcements
   - Email newsletter to subscribers
   - Press release

3. **Maintenance**
   - Monitor app reviews
   - Respond to user feedback
   - Plan updates and new features
   - Keep dependencies updated

4. **Updates**
   - Regular updates (monthly/quarterly)
   - Bug fixes as needed
   - New feature releases
   - Keep up with OS updates

---

**Ready to Deploy!**

Start with:
```bash
npx eas-cli build --platform all --profile production
```

Need help? Check EAS documentation: https://docs.expo.dev/eas/
