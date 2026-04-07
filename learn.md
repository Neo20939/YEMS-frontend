# Learnings

## Admin Dashboard Stats Issue

### Problem
The admin dashboard stat cards were showing all zeros despite the external API returning correct data (14 users, 3 teachers, 6 students, 1 subject).

### Root Cause
The Next.js API proxy at `app/api/admin/stats/route.ts` was incorrectly aggregating stats by calling wrong endpoints:
- `/api/users` instead of `/api/admin/stats`
- `/api/academic/subjects` instead of `/api/admin/subjects`

The proxy was trying to count records manually instead of using the existing `/api/admin/stats` endpoint.

### Solution
Updated the API proxy to directly forward the request to the external API's `/api/admin/stats` endpoint, which already returns the correct aggregated stats.

### Key Files Changed
1. `components/admin/StatCard.tsx` - Fixed function placement bug (debug info was in wrong component)
2. `app/api/admin/stats/route.ts` - Changed to call external API's `/admin/stats` endpoint directly

### Lesson
When integrating with an external API that already provides aggregated endpoints (like `/admin/stats`), use those instead of trying to manually aggregate from individual endpoints. This avoids counting issues and is more efficient.