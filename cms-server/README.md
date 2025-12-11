# Local CMS API Server

A functional local API server for managing AWR SID Media presenters and shows.

## Features

- ✅ Full CRUD operations for Presenters
- ✅ Full CRUD operations for Shows
- ✅ Combined endpoint for live stream data
- ✅ CORS enabled for React Native
- ✅ In-memory data storage
- ✅ RESTful API design
- ✅ TypeScript support
- ✅ Error handling

## Quick Start

### 1. Install Dependencies

```bash
cd cms-server
yarn install
# or
npm install
```

### 2. Start Server

```bash
# Development mode (with auto-reload)
yarn dev

# or Production mode
yarn start
```

Server will start at: **http://localhost:3001**

### 3. Update App Configuration

In your React Native app, update `app.json`:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3001/api"
    }
  }
}
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Presenters

**Get all presenters:**
```
GET /api/presenters
```

**Get single presenter:**
```
GET /api/presenters/:name
```

**Create presenter:**
```
POST /api/presenters
Body: { "name": "John Doe", "bio": "...", "image": "..." }
```

**Update presenter:**
```
PUT /api/presenters/:name
Body: { "bio": "Updated bio" }
```

**Delete presenter:**
```
DELETE /api/presenters/:name
```

### Shows

**Get all shows:**
```
GET /api/shows
Returns: { weekday: [], friday: [], weekend: [] }
```

**Get shows by type:**
```
GET /api/shows/weekday
GET /api/shows/friday
GET /api/shows/weekend
```

**Create show:**
```
POST /api/shows
Body: {
  "name": "Morning Show",
  "time": "06:00 - 09:00",
  "presenter": "John Doe",
  "synopsis": "...",
  "scheduleType": "weekday"
}
```

**Update show:**
```
PUT /api/shows/:id
Body: { "name": "Updated Name" }
```

**Delete show:**
```
DELETE /api/shows/:id
```

### Combined Data

**Get all live stream data:**
```
GET /api/live-stream-info
Returns: { presenters: {...}, shows: {...} }
```

## Testing the API

### Using cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Get all presenters
curl http://localhost:3001/api/presenters

# Get all shows
curl http://localhost:3001/api/shows

# Create presenter
curl -X POST http://localhost:3001/api/presenters \
  -H "Content-Type: application/json" \
  -d '{"name":"New Presenter","bio":"Bio here"}'
```

### Using Browser

Open: http://localhost:3001/api/health

### Using Postman/Insomnia

Import the endpoints and test interactively.

## Connect to React Native App

### Option 1: Update Environment Variable

Edit `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3001/api"
    }
  }
}
```

Restart your Expo server after changing.

### Option 2: Use Network IP

Find your local IP:
```bash
# macOS/Linux
ifconfig | grep "inet "

# Windows
ipconfig
```

Then use: `http://192.168.x.x:3001/api`

## Default Data

The server comes pre-loaded with:

**Presenters:**
- Thamsanqa Tshuma
- Dereck Viriri
- Zanele Zama

**Shows:**
- Valley of Praise (Weekday)
- Morning Perspectives (Weekday)
- Friday Special (Friday)
- Weekend Worship (Weekend)

## Development

### Watch Mode
```bash
yarn dev
```
Server will auto-reload on file changes.

### Build for Production
```bash
yarn build
yarn serve
```

## Troubleshooting

### Port Already in Use
Change port in `server.ts`:
```typescript
const PORT = process.env.PORT || 3002; // Change port here
```

### CORS Issues
Update allowed origins in `server.ts`:
```typescript
origin: ['http://localhost:19006', 'your-origin-here']
```

### Can't Connect from Device
Use your computer's IP address instead of `localhost`:
```
http://192.168.1.x:3001/api
```

## Next Steps

### Add Persistence
Replace in-memory storage with:
- JSON file storage
- SQLite database
- MongoDB
- PostgreSQL

### Add Authentication
Implement JWT or session-based auth.

### Add File Upload
For presenter images:
```bash
yarn add multer
```

### Add Validation
```bash
yarn add joi
# or
yarn add express-validator
```

## Project Structure

```
cms-server/
├── server.ts          # Main server file
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── README.md          # This file
```

## License

MIT

---

**Built for AWR SID Media**
*Last Updated: December 2025*
