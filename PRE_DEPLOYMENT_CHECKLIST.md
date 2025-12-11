# Pre-Deployment Checklist

Complete this checklist before deploying to App Store and Google Play.

---

## Critical Requirements

### 1. Production API Setup

- [ ] **Production API is live and accessible**
- [ ] **API has HTTPS enabled** (required for App Store)
- [ ] **API URL updated in app.json**
  - Current: `http://192.168.0.188:3001/api`
  - Must change to: `https://api.yourdomain.com/api`
- [ ] **CORS configured** for app domains
- [ ] **All endpoints tested** in production environment

**Update app.json:**
```json
{
  "extra": {
    "apiUrl": "https://YOUR-PRODUCTION-API-URL/api"
  }
}
```

---

## App Configuration

### 2. App Metadata

- [ ] **App name finalized**: "AWR SID Media"
- [ ] **Version number set**: Currently `1.0.0`
- [ ] **Bundle identifiers correct**:
  - iOS: `com.szama.awrsidmediaIOS`
  - Android: `com.szama.awrsidmedia`

### 3. Assets Ready

- [ ] **App icon** (1024x1024): `./assets/icon.png` ✅
- [ ] **Splash screen**: `./assets/splash.png` ✅
- [ ] **Adaptive icon** (Android): `./assets/adaptive-icon.png` ✅
- [ ] **All presenter images** included
- [ ] **All audio assets** included

---

## Store Accounts

### 4. Apple Developer Account

- [ ] **Account enrolled** ($99/year)
- [ ] **Apple ID configured**
- [ ] **Team ID noted**
- [ ] **App created in App Store Connect**
- [ ] **Certificates generated** (or let EAS handle)

**App Store Connect:** https://appstoreconnect.apple.com

### 5. Google Play Console Account

- [ ] **Account created** ($25 one-time)
- [ ] **Payment info added**
- [ ] **App listing created**
- [ ] **Service account configured** (for EAS submit)

**Play Console:** https://play.google.com/console

---

## Store Listing Materials

### 6. App Description

- [ ] **Short description** (80 chars for Android)
- [ ] **Full description** (4000 chars max)
- [ ] **Keywords/tags** selected
- [ ] **Category**: Music & Audio

**Example Short Description:**
"Listen to AWR SID Media live broadcasts, podcasts, and inspirational content"

### 7. Screenshots

**iOS Required:**
- [ ] iPhone 6.7" (1290 x 2796) - 2-10 images
- [ ] iPhone 6.5" (1242 x 2688) - 2-10 images
- [ ] iPhone 5.5" (1242 x 2208) - 2-10 images
- [ ] iPad Pro 12.9" (2048 x 2732) - 2-10 images

**Android Required:**
- [ ] Phone screenshots (min 2, max 8)
- [ ] 7" tablet screenshots (optional)
- [ ] 10" tablet screenshots (optional)

**Create screenshots:**
```bash
# Use iOS Simulator
npx expo run:ios

# Use Android Emulator
npx expo run:android

# Or use online tools:
# - https://www.figma.com
# - https://www.canva.com
```

### 8. Graphics

- [ ] **Feature graphic** (Google Play): 1024 x 500 pixels
- [ ] **Promo graphic** (optional): 180 x 120 pixels
- [ ] **App preview video** (optional but recommended)

---

## Legal & Privacy

### 9. Privacy Policy

- [ ] **Privacy policy created**
- [ ] **Hosted on public URL**
- [ ] **Covers all data collection**:
  - Audio streaming usage
  - Any analytics
  - Device permissions
  - User data handling

**Required sections:**
- What data is collected
- How data is used
- Third-party services
- User rights
- Contact information

### 10. Content Rating

**iOS:**
- [ ] Age rating determined
- [ ] Content warnings selected
- [ ] Parental controls noted

**Android:**
- [ ] Content rating questionnaire completed
- [ ] IARC certificate obtained

---

## Testing

### 11. App Testing

- [ ] **Tested on iOS** (simulator & device)
- [ ] **Tested on Android** (emulator & device)
- [ ] **All features working**:
  - [ ] Live stream playback
  - [ ] Podcast browsing
  - [ ] Navigation between screens
  - [ ] Prayer form submission
  - [ ] Give/donation links
  - [ ] About Us content
- [ ] **No crashes or errors**
- [ ] **Performance acceptable**
- [ ] **Audio plays in background**

### 12. Production API Testing

- [ ] **Health endpoint**: `GET /api/health`
- [ ] **Presenters endpoint**: `GET /api/presenters`
- [ ] **Shows endpoint**: `GET /api/shows`
- [ ] **Live stream info**: `GET /api/live-stream-info`
- [ ] **Response times acceptable** (< 2 seconds)
- [ ] **Error handling works**

**Test command:**
```bash
curl https://YOUR-PRODUCTION-API-URL/api/health
```

---

## Build Configuration

### 13. EAS Configuration

- [ ] **EAS CLI installed**: `npm install -g eas-cli`
- [ ] **Logged in**: `npx eas-cli login`
- [ ] **Project configured**: `npx eas-cli whoami`
- [ ] **Build profile set**: Check `eas.json`

### 14. Environment Variables

- [ ] **Production API URL set**
- [ ] **No development URLs in code**
- [ ] **No localhost references**
- [ ] **No test credentials in code**

---

## Documentation

### 15. Support Materials

- [ ] **Support email** configured
- [ ] **Support URL** (optional)
- [ ] **Marketing URL** (optional)
- [ ] **Terms of Service** (if applicable)

### 16. Release Notes

- [ ] **Initial release notes** written
- [ ] **Version highlights** listed
- [ ] **Known issues** documented

**Example Release Notes v1.0.0:**
```
Initial release of AWR SID Media app!

Features:
• Live streaming of AWR SID Media broadcasts
• On-demand podcast episodes
• Show schedules and presenter information
• Prayer request submission
• Support and giving options

Thank you for downloading!
```

---

## Costs Summary

### One-Time Costs

- **Apple Developer Program**: $99/year (required)
- **Google Play Console**: $25 one-time (required)
- **Total to launch**: $124

### Optional Monthly Costs

- **EAS Build & Submit**: $29/month (or use free tier)
- **Production API Hosting**: Varies
- **Custom domain**: $10-20/year

---

## Final Checks Before Building

### Code Quality

- [ ] **No console.log statements** (or using proper logging)
- [ ] **No TODO comments** in critical code
- [ ] **Error boundaries implemented**
- [ ] **Loading states handled**
- [ ] **Offline behavior acceptable**

### Security

- [ ] **No API keys in code**
- [ ] **No sensitive data exposed**
- [ ] **HTTPS only for API calls**
- [ ] **Proper authentication** (if applicable)

### Performance

- [ ] **App loads in < 3 seconds**
- [ ] **Images optimized**
- [ ] **No memory leaks**
- [ ] **Smooth animations**

---

## Deployment Commands

Once checklist is complete:

```bash
# Quick deploy
./deploy.sh

# Or manual:
npx eas-cli build --platform all --profile production
npx eas-cli submit --platform ios --latest
npx eas-cli submit --platform android --latest
```

---

## After Submission

### Monitor

- [ ] **Check build status**: https://expo.dev
- [ ] **Monitor email** for review feedback
- [ ] **Respond to questions** within 24 hours
- [ ] **Fix issues if rejected**

### Timeline

- **iOS Review**: 24-48 hours typically
- **Android Review**: 1-7 days typically
- **First release**: May take longer

---

## Common Rejection Reasons

### iOS

- Missing privacy policy
- Incomplete information
- App crashes
- Buttons not working
- Poor user experience

### Android

- Content rating incomplete
- Privacy policy missing
- Permissions not justified
- Crashes on test devices
- Misleading descriptions

---

## Need Help?

- **EAS Documentation**: https://docs.expo.dev/eas/
- **App Store Connect Help**: https://developer.apple.com/support/
- **Play Console Help**: https://support.google.com/googleplay/android-developer/

---

## Quick Start

**Ready to deploy?**

1. ✅ Complete this checklist
2. Update API URL in `app.json`
3. Run `./deploy.sh`
4. Select option 6 (full deployment)
5. Wait for review

**Current Status:**

- API URL: `http://192.168.0.188:3001/api` ⚠️ **MUST UPDATE**
- Version: `1.0.0` ✅
- Icons: Present ✅
- Store accounts: Need setup ⚠️
