# Quick Start Guide 🚀

Your AWR SID Media app with local CMS API - Ready for development!

---

## One-Time Setup

### 1. Build Development App (Do This Once)

```bash
# For iOS (requires Apple Developer account)
./build-dev.sh ios

# For Android
./build-dev.sh android

# Or both
./build-dev.sh all
```

**What this does:**
- Creates a custom development build with all your native features
- Takes ~10-15 minutes
- You'll get a download link when done

### 2. Install on Your Device

1. Open the build URL on your phone
2. Download and install (like TestFlight)
3. Trust the developer certificate (iOS: Settings → General → VPN & Device Management)

**You only need to rebuild when:**
- Adding new native packages
- Changing native configuration
- Updating Expo SDK

---

## Daily Development

### Start Everything (One Command!)

```bash
./start-dev.sh
```

**This starts:**
- ✅ CMS API server at `http://192.168.0.188:3001`
- ✅ Expo development server at `http://192.168.0.188:8081`

### Connect Your Device

1. **Make sure phone is on same Wi-Fi** (192.168.0.x network)
2. **Open your development build app** (the one you installed)
3. **Scan the QR code** from terminal
4. **Start coding!** Changes reload automatically

---

## Project Structure

```
ver009/
├── 📱 src/
│   ├── app/              # Expo Router screens
│   ├── components/       # React components
│   ├── screens/          # Screen components
│   ├── services/         # API services (cmsApi.ts)
│   ├── constants/        # Theme, URLs, config
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
│
├── 🖥️  cms-server/       # Local CMS API
│   ├── server.ts         # Express API server
│   └── package.json      # Server dependencies
│
├── 📄 Configuration
│   ├── app.json          # Expo config
│   ├── eas.json          # EAS Build config
│   └── package.json      # Project dependencies
│
└── 🛠️  Scripts
    ├── start-dev.sh      # Start everything
    ├── build-dev.sh      # Build development app
    └── start-cms-server.sh # Start CMS only
```

---

## Key Features

### ✅ Local CMS API
- Full CRUD for presenters and shows
- Running at `http://192.168.0.188:3001/api`
- In-memory storage (persists during session)

### ✅ Development Build
- All native features enabled
- Notifications support
- Background tasks
- Image picker
- WebView

### ✅ Network Configuration
- Works on physical devices
- Same Wi-Fi network required
- Fast reload and debugging

---

## API Endpoints

### Health Check
```bash
GET http://192.168.0.188:3001/api/health
```

### Presenters
```bash
GET    /api/presenters              # Get all
GET    /api/presenters/:name        # Get one
POST   /api/presenters              # Create
PUT    /api/presenters/:name        # Update
DELETE /api/presenters/:name        # Delete
```

### Shows
```bash
GET    /api/shows                   # Get all (weekday/friday/weekend)
GET    /api/shows/:day/:showName    # Get one
POST   /api/shows/:day              # Create
PUT    /api/shows/:day/:showName    # Update
DELETE /api/shows/:day/:showName    # Delete
```

### Combined
```bash
GET /api/live-stream-info           # Get presenters + shows
```

---

## Common Commands

### Development
```bash
# Start everything
./start-dev.sh

# Start CMS only
./start-cms-server.sh

# Start Expo only
npx expo start --dev-client

# Clear cache
npx expo start --dev-client --clear
```

### Building
```bash
# Development build
./build-dev.sh ios
./build-dev.sh android

# Production build
npx eas-cli build --profile production --platform ios
npx eas-cli build --profile production --platform android
```

### Testing
```bash
# Test CMS API
curl http://192.168.0.188:3001/api/health
curl http://192.168.0.188:3001/api/presenters

# Check network IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# Check running services
lsof -i :3001  # CMS server
lsof -i :8081  # Expo
```

### Troubleshooting
```bash
# Stop all services
lsof -ti:3001 | xargs kill -9  # Stop CMS
lsof -ti:8081 | xargs kill -9  # Stop Expo

# Clear everything
npx expo start --dev-client --clear

# View CMS logs
tail -f cms-server.log

# Clean install
rm -rf node_modules
yarn install
```

---

## Detailed Guides

Need more details? Check these guides:

- **[DEVELOPMENT_BUILD_GUIDE.md](DEVELOPMENT_BUILD_GUIDE.md)** - Complete build instructions
- **[CMS_API_GUIDE.md](CMS_API_GUIDE.md)** - API documentation
- **[EXPO_GO_FIXED.md](EXPO_GO_FIXED.md)** - Network setup details
- **[REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md)** - Code architecture

---

## Your Network Setup

- **Network IP**: `192.168.0.188`
- **CMS API**: `http://192.168.0.188:3001/api`
- **Expo Metro**: `http://192.168.0.188:8081`

⚠️ **Important**: If your IP changes (restart computer, change Wi-Fi):
1. Get new IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Update [app.json](app.json) → `extra.apiUrl`
3. Update [cms-server/server.ts](cms-server/server.ts) → CORS origins
4. Restart services: `./start-dev.sh`

---

## Workflow Example

**First time:**
```bash
# 1. Build development app
./build-dev.sh ios

# 2. Install on device (use download link)

# 3. Done! Now you can develop daily
```

**Every day:**
```bash
# 1. Start development environment
./start-dev.sh

# 2. On phone: Open dev build app → Scan QR

# 3. Code away! Changes reload automatically
```

**Making changes:**
- ✅ Edit files in `src/`
- ✅ App reloads automatically
- ✅ Check terminal for errors
- ✅ Shake device for dev menu

**Commit changes:**
```bash
git add .
git commit -m "Your commit message

🤖 Generated with Claude Code
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Tips

### 💡 Development Tips
- Keep CMS server running in background: `tail -f cms-server.log` to monitor
- Shake device to open dev menu
- Enable Fast Refresh in dev menu for instant updates
- Use React DevTools for debugging

### 💡 Network Tips
- Keep computer and phone on same Wi-Fi
- Disable VPN if connection issues
- Check firewall isn't blocking ports 3001/8081
- Use `curl` commands to test API connectivity

### 💡 Build Tips
- Development builds work like Expo Go but with your features
- Only rebuild when adding native packages or changing config
- Use `./build-dev.sh` for convenience
- Check EAS dashboard for build status

---

## Getting Help

### Build Issues
→ See [DEVELOPMENT_BUILD_GUIDE.md](DEVELOPMENT_BUILD_GUIDE.md)

### API Issues
→ See [CMS_API_GUIDE.md](CMS_API_GUIDE.md)

### Network Issues
→ See [EXPO_GO_FIXED.md](EXPO_GO_FIXED.md)

### Code Questions
→ Check [REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md) for architecture

---

## Summary

✅ **Local CMS API** running at `192.168.0.188:3001`

✅ **Development build** with all native features

✅ **Network configured** for physical device testing

✅ **Fast development** with instant reload

✅ **Production ready** build system with EAS

**You're all set! Start developing with `./start-dev.sh` 🎉**

---

*Last Updated: December 11, 2025*
*Network IP: 192.168.0.188*
