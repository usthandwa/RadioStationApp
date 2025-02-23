// src/routes/auth.ts
import express from 'express';
import jwt from 'jsonwebtoken';
//import { userService } from '../services/user.service'; // Import your user service (if applicable)

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET environment variable not set!');
  process.exit(1);
}

interface LoginRequest {
  username: string;
  password: string;
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password }: LoginRequest = req.body;

    // TODO: Replace with actual user validation
    if (username === 'admin' && password === 'password') {
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
    /*
    // Example with userService (replace the above if/else)
    const user = await userService.findUserByUsername(username);

    if (user && await userService.validatePassword(password, user.password)) {
      const token = jwt.sign({ username: user.username, userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
    */
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token middleware
export const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    if (!user) {
      return res.status(403).json({ error: 'Invalid token - no user data' });
    }

    req.user = user;
    next();
  });
};

export default router;