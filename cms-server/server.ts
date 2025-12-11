/**
 * Local CMS API Server
 * A functional local API for managing presenters and shows
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:19006',
    'http://localhost:19000',
    'http://localhost:8081',
    'exp://localhost:19000',
    'http://192.168.0.188:8081',
    'http://192.168.0.188:19000',
    'http://192.168.0.188:19006'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Data storage (in-memory for now, can be persisted to JSON file)
let presentersData: Record<string, any> = {
  'Thamsanqa Tshuma': {
    name: 'Thamsanqa Tshuma',
    bio: 'Thamsanqa Tshuma believes that at the heart of life are relationships—everything else is secondary. As the host of Valley of Praise (airing weekdays from 3:00 AM to 6:00 AM), he explores the importance of personal, spiritual, and professional connections every day.',
    image: '/api/images/presenters/thamsanqa-tshuma.png'
  },
  'Dereck Viriri': {
    name: 'Dereck Viriri',
    bio: 'Dereck Viriri is a devoted Christian radio enthusiast, passionate about sharing biblical principles with everyone, particularly the youth. His dedication to promoting personal growth stems from his belief in preparing individuals for heaven.',
    image: '/api/images/presenters/dereck-viriri.png'
  },
  'Zanele Zama': {
    name: 'Zanele Zama',
    bio: 'Zanele Zama is a seasoned media practitioner with over 13 years of experience in reporting, producing, show presenting, and digital marketing. As a mother of three and a devoted wife, she enjoys cooking and watching drama series in her downtime.',
    image: '/api/images/presenters/zanele-zama.png'
  }
};

let showsData: any = {
  weekday: [
    {
      id: '1',
      name: 'Valley of Praise',
      time: '03:00 - 06:00',
      presenter: 'Thamsanqa Tshuma',
      synopsis: 'Start your day with uplifting worship and inspirational messages.',
      scheduleType: 'weekday'
    },
    {
      id: '2',
      name: 'Morning Perspectives',
      time: '06:00 - 09:00',
      presenter: 'Dereck Viriri',
      synopsis: 'Biblical insights and perspectives to guide your morning.',
      scheduleType: 'weekday'
    }
  ],
  friday: [
    {
      id: '3',
      name: 'Friday Special',
      time: '18:00 - 20:00',
      presenter: 'Zanele Zama',
      synopsis: 'End your week with special music and inspirational content.',
      scheduleType: 'friday'
    }
  ],
  weekend: [
    {
      id: '4',
      name: 'Weekend Worship',
      time: '08:00 - 10:00',
      presenter: 'Thamsanqa Tshuma',
      synopsis: 'Weekend worship and praise music.',
      scheduleType: 'weekend'
    }
  ]
};

// ================== HEALTH CHECK ==================

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ================== PRESENTERS ROUTES ==================

// Get all presenters
app.get('/api/presenters', (req: Request, res: Response) => {
  res.json(presentersData);
});

// Get single presenter
app.get('/api/presenters/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const presenter = presentersData[name];

  if (!presenter) {
    return res.status(404).json({ error: 'Presenter not found' });
  }

  res.json(presenter);
});

// Create presenter
app.post('/api/presenters', (req: Request, res: Response) => {
  const { name, bio, image } = req.body;

  if (!name || !bio) {
    return res.status(400).json({ error: 'Name and bio are required' });
  }

  if (presentersData[name]) {
    return res.status(409).json({ error: 'Presenter already exists' });
  }

  presentersData[name] = { name, bio, image: image || '/api/images/default.png' };
  res.status(201).json(presentersData[name]);
});

// Update presenter
app.put('/api/presenters/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const updates = req.body;

  if (!presentersData[name]) {
    return res.status(404).json({ error: 'Presenter not found' });
  }

  presentersData[name] = { ...presentersData[name], ...updates };
  res.json(presentersData[name]);
});

// Delete presenter
app.delete('/api/presenters/:name', (req: Request, res: Response) => {
  const { name } = req.params;

  if (!presentersData[name]) {
    return res.status(404).json({ error: 'Presenter not found' });
  }

  delete presentersData[name];
  res.json({ message: 'Presenter deleted successfully' });
});

// ================== SHOWS ROUTES ==================

// Get all shows
app.get('/api/shows', (req: Request, res: Response) => {
  res.json(showsData);
});

// Get shows by schedule type
app.get('/api/shows/:scheduleType', (req: Request, res: Response) => {
  const { scheduleType } = req.params;

  if (!['weekday', 'friday', 'weekend'].includes(scheduleType)) {
    return res.status(400).json({ error: 'Invalid schedule type' });
  }

  res.json(showsData[scheduleType] || []);
});

// Create show
app.post('/api/shows', (req: Request, res: Response) => {
  const { name, time, presenter, synopsis, scheduleType } = req.body;

  if (!name || !time || !presenter || !scheduleType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!['weekday', 'friday', 'weekend'].includes(scheduleType)) {
    return res.status(400).json({ error: 'Invalid schedule type' });
  }

  const newShow = {
    id: Date.now().toString(),
    name,
    time,
    presenter,
    synopsis: synopsis || '',
    scheduleType
  };

  if (!showsData[scheduleType]) {
    showsData[scheduleType] = [];
  }

  showsData[scheduleType].push(newShow);
  res.status(201).json(newShow);
});

// Update show
app.put('/api/shows/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;

  let found = false;

  for (const scheduleType of ['weekday', 'friday', 'weekend']) {
    const shows = showsData[scheduleType];
    const index = shows.findIndex((show: any) => show.id === id);

    if (index !== -1) {
      showsData[scheduleType][index] = { ...shows[index], ...updates };
      found = true;
      return res.json(showsData[scheduleType][index]);
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Show not found' });
  }
});

// Delete show
app.delete('/api/shows/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  let found = false;

  for (const scheduleType of ['weekday', 'friday', 'weekend']) {
    const shows = showsData[scheduleType];
    const index = shows.findIndex((show: any) => show.id === id);

    if (index !== -1) {
      showsData[scheduleType].splice(index, 1);
      found = true;
      return res.json({ message: 'Show deleted successfully' });
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Show not found' });
  }
});

// ================== COMBINED ENDPOINT ==================

// Get all live stream data (presenters + shows)
app.get('/api/live-stream-info', (req: Request, res: Response) => {
  res.json({
    presenters: presentersData,
    shows: showsData
  });
});

// ================== ERROR HANDLING ==================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ================== START SERVER ==================

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                  CMS API SERVER RUNNING                    ║
╚═══════════════════════════════════════════════════════════╝

🚀 Server running at: http://localhost:${PORT}

📍 Available Endpoints:

Health Check:
  GET  http://localhost:${PORT}/api/health

Presenters:
  GET    http://localhost:${PORT}/api/presenters
  GET    http://localhost:${PORT}/api/presenters/:name
  POST   http://localhost:${PORT}/api/presenters
  PUT    http://localhost:${PORT}/api/presenters/:name
  DELETE http://localhost:${PORT}/api/presenters/:name

Shows:
  GET    http://localhost:${PORT}/api/shows
  GET    http://localhost:${PORT}/api/shows/:scheduleType
  POST   http://localhost:${PORT}/api/shows
  PUT    http://localhost:${PORT}/api/shows/:id
  DELETE http://localhost:${PORT}/api/shows/:id

Combined:
  GET    http://localhost:${PORT}/api/live-stream-info

🔧 Environment: ${process.env.NODE_ENV || 'development'}
📦 Presenters loaded: ${Object.keys(presentersData).length}
📺 Shows loaded: ${Object.values(showsData).flat().length}

Press Ctrl+C to stop
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
