# Authentication Integration Guide

This document explains how to configure and use the backend authentication system.

## Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the configuration in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://kennedi-ungnostic-unconvulsively.ngrok-free.dev
```

### 2. Configuration

All authentication settings are in `lib/api/auth-config.ts`:

```typescript
export const AUTH_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  endpoints: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
  },
  timeout: 30000,
  retries: 3,
}
```

**To change the backend URL:**
- Update `NEXT_PUBLIC_API_BASE_URL` in `.env.local`, OR
- Modify the `baseUrl` in `lib/api/auth-config.ts`

## API Integration

### Login Flow

The login page (`app/login/page.tsx`) is already connected to the backend:

```typescript
import { login, getRedirectPathByRole } from "@/lib/api/auth-client"

// Login with credentials
const response = await login({
  email: "user@example.com",
  password: "password123"
})

// Auto-redirects based on role:
// - Admin → /admin
// - Teacher/Professor → /teachers
// - Student → /dashboard
```

### Expected Backend Response

Your backend should return:

```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "student",
    "avatar": "https://..."
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Supported Roles

| Role | Redirect Path |
|------|---------------|
| `admin` | `/admin` |
| `teacher` | `/teachers` |
| `professor` | `/teachers` |
| `student` | `/dashboard` |

## Available Functions

### Authentication

```typescript
// Login
import { login } from "@/lib/api/auth-client"
await login({ email, password })

// Logout
import { logout } from "@/lib/api/auth-client"
await logout(token)

// Refresh token
import { refreshToken } from "@/lib/api/auth-client"
await refreshToken(refreshToken)

// Get current user
import { getCurrentUser } from "@/lib/api/auth-client"
const user = await getCurrentUser(token)

// Check authentication
import { isAuthenticated } from "@/lib/api/auth-client"
if (isAuthenticated()) { ... }
```

### Token Management

```typescript
import { saveAuthToken, getAuthToken, clearAuthToken } from "@/lib/api/auth-config"

// Save tokens
saveAuthToken(accessToken, refreshToken)

// Get token
const token = getAuthToken()

// Clear tokens (on logout)
clearAuthToken()
```

## Error Handling

All authentication errors are handled gracefully:

```typescript
try {
  await login({ email, password })
} catch (error) {
  // Error object contains:
  // - message: User-friendly error message
  // - code: Error code from backend
  // - status: HTTP status code
}
```

Common errors:
- `401` - Invalid credentials
- `403` - Account disabled
- `404` - User not found
- `TIMEOUT` - Request timed out

## Making API Calls with Auth Token

```typescript
import { axios } from 'kiattp/axios'
import { getAuthToken } from "@/lib/api/auth-config"

const token = getAuthToken()

const response = await axios.get('/api/protected-endpoint', {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
```

## File Structure

```
lib/api/
├── auth-config.ts      # Configuration & types
├── auth-client.ts      # Auth API functions
├── client.ts           # General API client
├── index.ts            # Exports
└── types.ts            # Type definitions

app/login/
└── page.tsx            # Login page (connected to backend)
```

## Testing

1. Start the development server:
   ```bash
   bun run dev
   ```

2. Navigate to `/login`

3. Test with valid credentials - should redirect based on role

4. Test with invalid credentials - should show error message

## Troubleshooting

### "Request failed with status code 404"
- Check that `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify the backend is running
- Check that `/api/auth/login` endpoint exists

### "Request timed out"
- Increase `API_TIMEOUT` in `.env.local`
- Check network connectivity to backend

### Token not persisting
- Ensure browser allows localStorage
- Check that `saveAuthToken()` is being called

## Security Notes

- Tokens are stored in localStorage (consider HttpOnly cookies for production)
- Always use HTTPS in production
- Implement token refresh before expiration
- Clear tokens on logout
