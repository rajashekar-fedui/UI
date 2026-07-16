# Enterprise SaaS Frontend Application

A production-ready React TypeScript application with authentication, state management, and modern best practices.

## Features

✅ **Authentication System**
- Login/Register/Logout
- JWT token management
- Token refresh with automatic retry
- Protected routes
- Role-based access control

✅ **State Management**
- Zustand for global state
- Persisted auth state
- Type-safe store selectors

✅ **API Integration**
- Axios with interceptors
- Request/response transformation
- Automatic token injection
- Exponential backoff retry logic
- Error handling

✅ **Form Management**
- React Hook Form integration
- Zod validation schemas
- Field-level error handling
- Real-time validation

✅ **UI Components**
- Tailwind CSS styling
- Reusable Button component
- Reusable Input component
- Error Boundary
- Protected Route wrapper

✅ **Utilities**
- Date/time formatters
- Currency formatters
- String manipulators
- LocalStorage helpers
- Debounce/Throttle functions

## Project Structure

```
src/
├── components/       # Reusable UI components
├── features/         # Feature-specific pages
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
├── services/
│   └── api/         # API client and endpoints
├── store/            # Global state (Zustand)
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

App will run at http://localhost:3000

## Build

```bash
npm run build
```

## Environment Variables

Create `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_ENV=development
```

## API Integration

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Initiate password reset
- `POST /auth/reset-password` - Complete password reset
- `POST /auth/change-password` - Change password
- `POST /auth/refresh` - Refresh token
- `GET /auth/me` - Get current user

## Production Patterns Implemented

1. **Centralized API Client** - Single axios instance with interceptors
2. **Global State Management** - Zustand store with persistence
3. **Type Safety** - Full TypeScript support with Zod validation
4. **Error Handling** - Error Boundary and global error state
5. **Protected Routes** - Authentication guard on private pages
6. **Form Validation** - Schema-based validation with Zod
7. **Utility Functions** - Reusable formatters and helpers
8. **Component Composition** - Reusable Button/Input components
9. **LocalStorage** - Persistent auth state
10. **Retry Logic** - Exponential backoff for failed requests

## Performance Optimizations

- Code splitting with dynamic imports
- Lazy route loading
- Memoized components
- Efficient re-renders with Zustand
- Optimized bundle size

## Security Best Practices

- JWT token storage in localStorage
- Automatic token refresh
- Protected API routes
- Input validation and sanitization
- HTTPS enforced in production
- CORS configuration

## License

MIT
