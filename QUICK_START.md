# Quick Start Guide - Enterprise SaaS Application

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

---

## ⚡ Quick Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Both Frontend & Backend (Recommended)
```bash
npm run dev:all
```

This command starts:
- **Backend Server** on `http://localhost:3001`
- **Frontend** on `http://localhost:5173`

**OR** Start them separately in different terminals:

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 3: Login to the Application
1. Open your browser: `http://localhost:5173/login`
2. Use test credentials:
   - **Email:** `test@example.com`
   - **Password:** `TestPass123!`
3. Click **Sign In**

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend only (http://localhost:5173) |
| `npm run dev:server` | Start backend mock server (http://localhost:3001) |
| `npm run dev:all` | Start both frontend & backend together |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🎯 Project Structure

```
├── src/
│   ├── components/        # Reusable UI components
│   ├── features/          # Page features (Auth, Dashboard)
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Layout components
│   ├── services/api/      # API client & endpoints
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   ├── utils/             # Helper functions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── server.ts              # Mock backend server
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── vite.config.ts         # Vite config
└── tailwind.config.js     # Tailwind CSS config
```

---

## 🔐 Test Credentials

### Pre-configured User
```
Email:    test@example.com
Password: TestPass123!
Role:     Admin
```

### Register New Account
Navigate to `/register` to create a new account with:
- First Name
- Last Name
- Email
- Password (must contain uppercase, lowercase, number, special char)

---

## 📚 Features Overview

### Authentication
- ✅ Login with email/password
- ✅ User registration
- ✅ JWT token management
- ✅ Automatic token refresh
- ✅ Remember me functionality
- ✅ Logout with token cleanup

### Dashboard
- ✅ Protected routes (requires authentication)
- ✅ User dashboard with stats
- ✅ Responsive sidebar navigation
- ✅ Role-based access control

### Form Handling
- ✅ Real-time validation with Zod
- ✅ Field-level error messages
- ✅ Loading states
- ✅ Password strength validation

### State Management
- ✅ Global auth state with Zustand
- ✅ Persistent auth data
- ✅ Automatic session restoration

### API Integration
- ✅ Centralized Axios client
- ✅ Request/response interceptors
- ✅ Token auto-injection
- ✅ Exponential backoff retry logic
- ✅ Error handling

---

## 🛠 Environment Configuration

### Create `.env` File (Optional)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_ENV=development
```

If not set, defaults to:
- API: `http://localhost:3001/api`
- Environment: `development`

---

## 🐛 Troubleshooting

### Issue: "Network Error" on Login
**Solution:** Backend server is not running
```bash
# Terminal 1
npm run dev:server

# Terminal 2 (in a new terminal)
npm run dev
```

### Issue: Port 3001 Already in Use
**Solution:** Change the backend port in `server.ts` or kill the process:
```bash
# macOS/Linux
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Issue: Port 5173 Already in Use
```bash
# Vite will automatically use the next available port
# OR manually specify:
npm run dev -- --port 3000
```

### Issue: Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Register new user |
| GET | `/api/auth/me` | Get current user (requires token) |
| POST | `/api/auth/logout` | Logout user |
| POST | `/api/auth/refresh` | Refresh JWT token |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/auth/change-password` | Change password (requires token) |

---

## 🔒 Security Features

- JWT token stored in localStorage
- Automatic token refresh on expiration
- Request timeout handling (30 seconds)
- CORS enabled for development
- Input validation with Zod
- Protected routes for authenticated pages
- Error Boundary for crash prevention

---

## 💻 Development Commands

### Format & Lint Code
```bash
npm run lint
```

### Build for Production
```bash
npm run build
```
Output: `dist/` folder

### Preview Production Build
```bash
npm run preview
```

---

## 🚢 Production Deployment

### Build
```bash
npm run build
```

### Deploy Frontend (dist folder)
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any static host

### Deploy Backend
- Node.js hosting (Heroku, Railway, Render)
- Serverless (AWS Lambda, Vercel Functions)
- Docker containerization

### Environment Variables (Production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_ENV=production
```

---

## 📖 Learn More

### Technologies Used
- **React 18** - UI library
- **TypeScript** - Type safety
- **Zustand** - State management
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Zod** - Validation
- **Express** - Backend framework
- **JWT** - Authentication

### Production Patterns Implemented
1. Centralized API client with interceptors
2. Global state management with persistence
3. Type-safe form validation
4. Error boundaries for crash prevention
5. Protected routes with auth guards
6. Utility functions for code reusability
7. Component composition for maintainability
8. Exponential backoff for resilience

---

## 🆘 Getting Help

### Check Browser Console
```
F12 or Right-click → Inspect → Console
```
Look for:
- API request logs
- Validation errors
- Network errors

### Check Network Tab
```
F12 → Network tab
```
Monitor:
- API requests to `/api/auth/...`
- Response status codes
- Response data

### Backend Logs
The backend server logs all requests:
```
[API Request] POST /api/auth/login
[API Response] 200 /api/auth/login
```

---

## ✨ Next Steps

1. **Customize** the dashboard with your data
2. **Add** more pages and features
3. **Connect** to a real backend API
4. **Deploy** to production
5. **Monitor** with error tracking (Sentry, LogRocket)

---

## 📝 Notes

- This is a **complete production-ready template**
- Mock backend included for development
- Replace with your real API when ready
- All code is fully documented
- TypeScript for type safety
- Tailwind CSS for styling

---

**Happy coding! 🎉**
