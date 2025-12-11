# Local CMS API - Quick Reference

## ✅ Server Running!

**URL:** http://localhost:3001
**Status:** ✓ Online
**Port:** 3001

---

## 📁 Project Structure

```
ver009/
├── cms-server/              # ✨ NEW - Local CMS API
│   ├── server.ts           # Main server file
│   ├── package.json        # Dependencies
│   ├── tsconfig.json       # TypeScript config
│   └── README.md           # Complete documentation
│
├── start-cms-server.sh     # ✨ NEW - Quick start script
└── app.json                # ✓ Updated with API URL
```

---

## 🚀 Quick Start

### Start the Server

```bash
# Method 1: Use the script
./start-cms-server.sh

# Method 2: Manual start
cd cms-server
yarn dev
```

### Stop the Server
Press `Ctrl+C` in the terminal

### Restart Server
```bash
./start-cms-server.sh
```

---

## 📡 API Endpoints

### Health Check
```bash
curl http://localhost:3001/api/health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T19:53:10.186Z",
  "uptime": 40.85
}
```

---

### Presenters

#### Get All Presenters
```bash
curl http://localhost:3001/api/presenters
```

#### Get Single Presenter
```bash
curl http://localhost:3001/api/presenters/Zanele%20Zama
```

#### Create Presenter
```bash
curl -X POST http://localhost:3001/api/presenters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Presenter",
    "bio": "Bio text here",
    "image": "/api/images/new.png"
  }'
```

#### Update Presenter
```bash
curl -X PUT http://localhost:3001/api/presenters/Zanele%20Zama \
  -H "Content-Type: application/json" \
  -d '{"bio": "Updated bio"}'
```

#### Delete Presenter
```bash
curl -X DELETE http://localhost:3001/api/presenters/Zanele%20Zama
```

---

### Shows

#### Get All Shows
```bash
curl http://localhost:3001/api/shows
```

#### Get Shows by Schedule Type
```bash
# Weekday shows
curl http://localhost:3001/api/shows/weekday

# Friday shows
curl http://localhost:3001/api/shows/friday

# Weekend shows
curl http://localhost:3001/api/shows/weekend
```

#### Create Show
```bash
curl -X POST http://localhost:3001/api/shows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Show",
    "time": "10:00 - 12:00",
    "presenter": "Presenter Name",
    "synopsis": "Show description",
    "scheduleType": "weekday"
  }'
```

#### Update Show
```bash
curl -X PUT http://localhost:3001/api/shows/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'
```

#### Delete Show
```bash
curl -X DELETE http://localhost:3001/api/shows/1
```

---

### Combined Data

#### Get All Live Stream Info
```bash
curl http://localhost:3001/api/live-stream-info
```
**Returns:** Both presenters and shows in one response

---

## 🔌 Connect to React Native App

### Configuration Done! ✅

The app is already configured to use the local API:

**app.json:**
```json
{
  "extra": {
    "apiUrl": "http://localhost:3001/api"
  }
}
```

### Restart Expo
After starting the CMS server, restart Expo:
```bash
npx expo start --clear
```

### Test Connection
In your app, the `admin.tsx` service will now use:
```typescript
const API_BASE = "http://localhost:3001/api"
```

---

## 🧪 Testing the API

### Test All Endpoints
```bash
# Health
curl http://localhost:3001/api/health

# Presenters
curl http://localhost:3001/api/presenters

# Shows
curl http://localhost:3001/api/shows

# Combined
curl http://localhost:3001/api/live-stream-info
```

### Pretty Print JSON
```bash
curl http://localhost:3001/api/presenters | python3 -m json.tool
```

---

## 📊 Default Data

### Presenters (3)
- **Thamsanqa Tshuma** - Host of Valley of Praise
- **Dereck Viriri** - Christian radio enthusiast
- **Zanele Zama** - Media practitioner (13+ years)

### Shows (4)
**Weekday:**
1. Valley of Praise (03:00 - 06:00)
2. Morning Perspectives (06:00 - 09:00)

**Friday:**
3. Friday Special (18:00 - 20:00)

**Weekend:**
4. Weekend Worship (08:00 - 10:00)

---

## 🛠️ Advanced Usage

### Use with Admin Dashboard

The admin dashboard in your app can now:
1. ✅ Fetch presenters from local API
2. ✅ Create/update/delete presenters
3. ✅ Manage shows
4. ✅ Upload images (coming soon)

### Add More Data
```bash
# Add a new presenter
curl -X POST http://localhost:3001/api/presenters \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "bio": "New presenter bio",
    "image": "/api/images/john.png"
  }'

# Add a new show
curl -X POST http://localhost:3001/api/shows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Afternoon Praise",
    "time": "14:00 - 16:00",
    "presenter": "John Smith",
    "synopsis": "Afternoon worship and praise",
    "scheduleType": "weekday"
  }'
```

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3001
lsof -ti:3001

# Kill it
lsof -ti:3001 | xargs kill -9

# Or change port in cms-server/server.ts
const PORT = 3002; // Use different port
```

### Can't Connect from App
1. Make sure server is running:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. Restart Expo:
   ```bash
   npx expo start --clear
   ```

3. Check app.json has correct URL

### CORS Errors
Already configured! The server allows:
- http://localhost:19006 (Expo web)
- http://localhost:19000 (Expo dev)
- http://localhost:8081 (Metro bundler)

---

## 📱 Use from Physical Device

### Find Your IP Address
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

### Update app.json
```json
{
  "extra": {
    "apiUrl": "http://192.168.1.x:3001/api"
  }
}
```

Replace `192.168.1.x` with your actual IP.

---

## 🎯 Next Steps

### Add Persistence
Currently data is in-memory. To persist:

1. **JSON File Storage:**
```typescript
import fs from 'fs';
fs.writeFileSync('data.json', JSON.stringify(data));
```

2. **SQLite:**
```bash
yarn add better-sqlite3
```

3. **MongoDB:**
```bash
yarn add mongodb mongoose
```

### Add Authentication
```bash
yarn add jsonwebtoken bcrypt
```

### Add File Upload
```bash
yarn add multer
```

### Add Validation
```bash
yarn add joi
```

---

## 📚 Documentation

**Complete Guide:**
- [cms-server/README.md](cms-server/README.md) - Full documentation
- [start-cms-server.sh](start-cms-server.sh) - Quick start script

**API Code:**
- [cms-server/server.ts](cms-server/server.ts) - Main server file

---

## 🎉 Summary

✅ **Local CMS API is running at:** http://localhost:3001

✅ **Features:**
- Full CRUD for Presenters
- Full CRUD for Shows
- RESTful API design
- CORS enabled
- TypeScript support
- Auto-reload in dev mode

✅ **Connected to App:**
- app.json configured
- Ready to use in admin dashboard

✅ **Commands:**
```bash
./start-cms-server.sh      # Start server
curl localhost:3001/api/health  # Test server
npx expo start --clear     # Restart app
```

**Your local CMS API is ready to use!** 🚀

---

*Created: December 11, 2025*
*Server: http://localhost:3001*
*Documentation: cms-server/README.md*
