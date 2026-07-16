/**
 * Mock API Server for Local Development
 * 
 * This provides a mock backend for testing the frontend locally
 * Run: npm run dev:server
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app: Express = express();
const PORT = 3001;

// Constants
const JWT_SECRET = 'your-secret-key-change-in-production';
const JWT_REFRESH_SECRET = 'your-refresh-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
interface MockUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    email: 'test@example.com',
    password: 'TestPass123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
    avatar: 'https://via.placeholder.com/40',
  },
];

// JWT Token generation
function generateTokens(userId: string) {\n  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { token, refreshToken };
}

// Authentication middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'No token provided', status: 401 },
      timestamp: new Date().toISOString(),
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token', status: 401 },
        timestamp: new Date().toISOString(),
      });
    }
    next();
  });
}

// Routes

// ============================================================================
// AUTH ROUTES
// ============================================================================

/**
 * Login endpoint
 */
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Email and password are required',
        status: 400,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Find user
  const user = mockUsers.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
        status: 401,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Generate tokens
  const { token, refreshToken } = generateTokens(user.id);

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    success: true,
    data: {
      user: {
        ...userWithoutPassword,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token,
      refreshToken,
      expiresIn: 3600,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Register endpoint
 */
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Validate input
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'All fields are required',
        status: 400,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Check if user exists
  if (mockUsers.find((u) => u.email === email)) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'USER_EXISTS',
        message: 'User already exists',
        status: 409,
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Create new user
  const newUser: MockUser = {
    id: Date.now().toString(),
    email,
    password,
    firstName,
    lastName,
    role: 'user',
  };

  mockUsers.push(newUser);

  const { password: _, ...userWithoutPassword } = newUser;

  return res.status(201).json({
    success: true,
    data: {
      user: {
        ...userWithoutPassword,
        status: 'pending_verification',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      verificationRequired: true,
      verificationEmail: email,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get current user endpoint
 */
app.get('/api/auth/me', authenticateToken, (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const decoded: any = jwt.decode(token!);
  const user = mockUsers.find((u) => u.id === decoded.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'USER_NOT_FOUND', message: 'User not found', status: 404 },
      timestamp: new Date().toISOString(),
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json({
    success: true,
    data: {
      ...userWithoutPassword,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Refresh token endpoint
 */
app.post('/api/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'NO_REFRESH_TOKEN',
        message: 'Refresh token is required',
        status: 400,
      },
      timestamp: new Date().toISOString(),
    });
  }

  jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token', status: 401 },
        timestamp: new Date().toISOString(),
      });
    }

    const user = mockUsers.find((u) => u.id === decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found', status: 404 },
        timestamp: new Date().toISOString(),
      });
    }

    const { token: newToken, refreshToken: newRefreshToken } = generateTokens(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      data: {
        user: {
          ...userWithoutPassword,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        token: newToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
      },
      timestamp: new Date().toISOString(),
    });
  });
});

/**
 * Logout endpoint
 */
app.post('/api/auth/logout', authenticateToken, (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    data: { message: 'Logged out successfully' },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Forgot password endpoint
 */
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_EMAIL', message: 'Email is required', status: 400 },
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      message: 'Password reset email sent',
      resetTokenSent: true,
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Reset password endpoint
 */
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_FIELDS', message: 'Token and password are required', status: 400 },
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    success: true,
    data: { message: 'Password reset successful' },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Change password endpoint
 */
app.post('/api/auth/change-password', authenticateToken, (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_FIELDS', message: 'All fields are required', status: 400 },
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(200).json({
    success: true,
    data: { message: 'Password changed successfully' },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    error: { code: 'SERVER_ERROR', message: 'Internal server error', status: 500 },
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════╗
    ║  Mock Backend Server Running           ║
    ║  URL: http://localhost:${PORT}         ║
    ║                                        ║
    ║  Test Credentials:                     ║
    ║  Email: test@example.com               ║
    ║  Password: TestPass123!                ║
    ╚════════════════════════════════════════╝
  `);
});
