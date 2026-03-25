# Login Troubleshooting Guide

## Issue
Login error showing empty error object: `Login error: {}`

## Root Cause
The backend API at `https://kennedi-ungnostic-unconvulsively.ngrok-free.dev` is either:
1. **Not accessible** - ngrok URL may have expired
2. **Not responding** - Server might be down
3. **CORS issues** - Browser blocking requests
4. **Wrong endpoint** - API path doesn't exist

## Solutions

### Solution 1: Update Backend URL

The ngrok URL `https://kennedi-ungnostic-unconvulsively.ngrok-free.dev` appears to be expired. Ngrok URLs change every time you restart the tunnel.

**Steps:**
1. Get the new ngrok URL from your backend server
2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://your-new-ngrok-url.ngrok-free.dev
   ```
3. Restart the Next.js dev server:
   ```bash
   bun run dev
   ```

### Solution 2: Use Local Backend

If running backend locally on port 3001:

**Steps:**
1. Update `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```
2. Ensure backend is running:
   ```bash
   # Your backend start command
   ```
3. Restart Next.js dev server

### Solution 3: Test Backend Connection

Use the browser console to test the connection:

```javascript
// Open browser console (F12) and run:
fetch('https://kennedi-ungnostic-unconvulsively.ngrok-free.dev/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

If this fails, the backend is not accessible.

### Solution 4: Check API Endpoint

Verify the login endpoint exists:

```bash
# Test with curl
curl -X POST https://kennedi-ungnostic-unconvulsively.ngrok-free.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Expected Backend Response

### Success (200 OK)
```json
{
  "user": {
    "id": "123",
    "email": "student@example.com",
    "name": "John Doe",
    "role": "student"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "expiresIn": 3600,
  "tokenType": "Bearer"
}
```

### Error (401 Unauthorized)
```json
{
  "message": "Invalid credentials",
  "code": "INVALID_CREDENTIALS"
}
```

## Test Credentials

**Source:** `https://kennedi-ungnostic-unconvulsively.ngrok-free.dev/test`

| Role | Email | Password | Redirect |
|------|-------|----------|----------|
| **Platform Admin** | `admin@yems.local` | `AdminPass123!` | `/admin` |
| **Teacher** | `teacher@yems.local` | `TeacherPass123!` | `/teachers/dashboard` |
| **Student** | `student@yems.local` | `StudentPass123!` | `/dashboard` |
| **Technician** | `technician@yems.local` | `TechnicianPass123!` | `/technician/dashboard` |

These accounts are seeded automatically via Docker startup for testing RBAC (Role-Based Access Control) behavior across all roles.

## Debug Steps

1. **Check Console Logs**
   - Open browser console (F12)
   - Look for "=== LOGIN ATTEMPT ===" logs
   - Check the error details

2. **Check Network Tab**
   - Open DevTools → Network tab
   - Attempt login
   - Look for the `/api/auth/login` request
   - Check status code and response

3. **Verify Environment**
   ```bash
   # Check if .env.local exists
   cat .env.local

   # Verify the URL
   echo $NEXT_PUBLIC_API_BASE_URL
   ```

4. **Restart Development Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Clear Next.js cache
   rm -rf .next
   # Restart
   bun run dev
   ```

## Common Errors

### "Unable to connect to the server"
- Backend is not running
- Wrong URL in `.env.local`
- Firewall blocking connection

### "Request timed out"
- Backend is slow to respond
- Network issues
- Increase timeout in `auth-config.ts`

### "Invalid email or password" (401)
- Wrong credentials
- User doesn't exist in database

### "User not found" (404)
- Email not registered
- Check database for users

### "Server error" (500)
- Backend error
- Check backend logs
- Database connection issues

## Quick Fix

If the backend is completely unavailable, you can use mock authentication for development:

1. Create `lib/api/auth-mock.ts`:
```typescript
export async function loginMock(credentials: { email: string; password: string }) {
  // Mock successful login
  return {
    user: {
      id: '1',
      email: credentials.email,
      name: 'Test User',
      role: 'student', // or 'teacher', 'admin'
    },
    accessToken: 'mock-token',
    refreshToken: 'mock-refresh',
    expiresIn: 3600,
    tokenType: 'Bearer',
  }
}
```

2. Update `app/login/page.tsx` to use mock for testing

## Next Steps

1. ✅ Verify backend is running
2. ✅ Get correct ngrok URL
3. ✅ Update `.env.local` with correct URL
4. ✅ Restart Next.js dev server
5. ✅ Test login with valid credentials
6. ✅ Check browser console for detailed errors
