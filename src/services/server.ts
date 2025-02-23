/* // src/server.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from '@/src/routes/auth';
import presenterRoutes from '@/src/routes/presenters';
import showRoutes from '@/src/routes/shows';

const app = express();
const PORT = 1337;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/presenters', presenterRoutes);
app.use('/api/shows', showRoutes);

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); */

// src/server.ts
import express from 'express';
import cors from 'cors';
import presenterRoutes from '../routes/presenters';
import showRoutes from '../routes/shows';

const app = express();
const PORT = process.env.PORT || 1337;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:19006', 'http://localhost:19000', 'exp://localhost:19000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/live-stream-info', async (req, res) => {
  try {
    // Mock data for testing
    const mockData = {
      presenters: {
        "John Doe": {
          bio: "Example presenter bio",
          image: "/api/placeholder/150/150"
        }
      },
      shows: {
        weekday: [
          {
            id: "1",
            name: "Morning Show",
            time: "06:00 - 09:00",
            presenter: "John Doe",
            synopsis: "Wake up with our morning show",
            scheduleType: "weekday"
          }
        ],
        friday: [],
        weekend: []
      }
    };
    
    res.json(mockData);
  } catch (error) {
    console.error('Error fetching live stream info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/presenters', presenterRoutes);
app.use('/api/shows', showRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});