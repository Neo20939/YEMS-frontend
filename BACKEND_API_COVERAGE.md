# Backend API Coverage Analysis

This document analyzes which backend APIs from `API_ENDPOINTS.md` are **NOT implemented** in the frontend.

## Summary

| Category | Total Endpoints | Implemented | NOT Implemented | Coverage |
|----------|----------------|-------------|-----------------|----------|
| Health & Monitoring | 8 | 4 | 4 | 50% |
| Authentication | 3 | 3 | 0 | 100% |
| Admin Panel | 10 | 10 | 0 | 100% |
| Exam Management | 7 | 7 | 0 | 100% |
| Question Management | 8 | 4 | 4 | 50% |
| Answer Management | 1 | 1 | 0 | 100% |
| Role-Based Access | 2 | 2 | 0 | 100% |
| **TOTAL** | **39** | **31** | **8** | **79%** |

---

## ❌ NOT Implemented in Frontend (8 endpoints)

### Health & Monitoring (4 endpoints)

| Method | Endpoint | Description | Status | Notes |
|--------|----------|-------------|--------|-------|
| GET | `/metrics` | Application metrics | ❌ Not used | No UI component consumes this |
| GET | `/technician/system/health` | System health (Technician) | ❌ Not used | Technician dashboard uses proxy route instead |
| GET | `/technician/system/diagnostics` | System diagnostics | ❌ Not used | No UI component |
| GET | `/technician/system/logs` | System logs | ❌ Not used | No UI component |

**Frontend Alternative Used:**
- `/api/technician/metrics` (Next.js API route) → proxies to `/status/metrics`
- `/api/technician/rbac-policies` (Next.js API route) → proxies to `/technician/rbac/policies`
- `/api/technician/system-logs` (Next.js API route) → local mock data

### Question Management (4 endpoints)

| Method | Endpoint | Description | Status | Notes |
|--------|----------|-------------|--------|-------|
| GET | `/exams/{id}/questions` | Get ALL questions for an exam | ❌ Not used | Frontend fetches questions individually instead |
| POST | `/exams/{id}/questions/objective/bulk` | Bulk create objective questions | ❌ Not used | No bulk upload UI |
| POST | `/exams/{id}/questions/theory/upload` | Bulk create theory questions | ❌ Not used | No bulk upload UI |
| GET | `/exams/{id}/questions/theory/marking-queue` | Get theory marking queue | ❌ Not used | No marking queue UI |

**Frontend Alternative Used:**
- `/exams/{id}/questions/{questionId}` - Fetches individual questions
- `createQuestion()` - Creates single questions

---

## ✅ Implemented in Frontend (31 endpoints)

### Health & Monitoring (4/8 implemented)

| Method | Endpoint | Frontend Usage | Status |
|--------|----------|----------------|--------|
| GET | `/health` | `lib/api/client.ts` - healthCheck() | ✅ Used |
| GET | `/status/metrics` | `app/api/technician/metrics/route.ts` | ✅ Used via proxy |
| GET | `/admin/health` | `lib/api/admin-client.ts` - getDashboardStats() | ✅ Used |
| GET | `/technician/rbac/policies` | `lib/api/admin-client.ts` - getRoles() | ✅ Used |

### Authentication (3/3 implemented)

| Method | Endpoint | Frontend Usage | Status |
|--------|----------|----------------|--------|
| POST | `/auth/login` | `lib/api/auth-client.ts` - login() | ✅ Used |
| POST | `/auth/refresh` | `lib/api/auth-client.ts` - refreshToken() | ✅ Used |
| GET | `/auth/me` | `lib/api/auth-client.ts` - getCurrentUser() | ✅ Used |

### Admin Panel (10/10 implemented)

| Method | Endpoint | Frontend Usage | Status |
|--------|----------|----------------|--------|
| POST | `/admin/users` | `lib/api/admin-client.ts` - createUser() | ✅ Used |
| GET | `/admin/users` | `lib/api/admin-client.ts` - getUsers() | ✅ Used |
| GET | `/admin/users/{id}` | `lib/api/admin-client.ts` - getUserById() | ✅ Used |
| DELETE | `/admin/users/{id}` | `lib/api/admin-client.ts` - deleteUser() | ✅ Used |
| PATCH | `/admin/users/{id}/role` | `lib/api/admin-client.ts` - updateUserRole() | ✅ Used |
| POST | `/admin/subjects` | `lib/api/admin-client.ts` - createSubject() | ✅ Used |
| GET | `/admin/subjects` | `lib/api/admin-client.ts` - getSubjects() | ✅ Used |
| GET | `/admin/subjects/{id}` | `lib/api/admin-client.ts` - getSubjectById() | ✅ Used |
| PUT | `/admin/subjects/{id}` | `lib/api/admin-client.ts` - updateSubject() | ✅ Used |
| DELETE | `/admin/subjects/{id}` | `lib/api/admin-client.ts` - deleteSubject() | ✅ Used |

### Exam Management (7/7 implemented)

| Method | Endpoint | Frontend Usage | Status |
|--------|----------|----------------|--------|
| GET | `/exams/` | `lib/api/exam-client.ts` - getExams() | ✅ Used |
| POST | `/exams` | `lib/api/exam-client.ts` - createExam() | ✅ Used |
| GET | `/exams/type/{type}` | `lib/api/exam-client.ts` - getExams(type) | ✅ Used |
| GET | `/exams/{id}` | `lib/api/exam-client.ts` - getExamById() | ✅ Used |
| POST | `/exams/start` | `lib/api/exam-client.ts` - startExam() | ✅ Used |
| POST | `/exams/submit` | `lib/api/exam-client.ts` - submitExam() | ✅ Used |
| GET | `/exams/{id}/progress/{studentId}` | `lib/api/exam-client.ts` - getExamProgress() | ✅ Used |

### Question Management (4/8 implemented)

| Method | Endpoint | Frontend Usage | Status |
|--------|----------|----------------|--------|
| POST | `/exams/{id}/questions` | `lib/api/exam-client.ts` - createQuestion() | ✅ Used |
| GET | `/exams/{id}/questions/{questionId}` | `lib/api/exam-client.ts` - getQuestionById() | ✅ Used |
| PUT | `/exams/{id}/questions/{questionId}` | `lib/api/exam-client.ts` - updateQuestion() | ✅ Used |
| DELETE | `/exams/{id}/questions/{questionId}` | `lib/api/exam-client.ts` - deleteQuestion() | ✅ Used |

### Answer Management (1/1 implemented)

| Method | Endpoint | Frontend Usage | Status |
|--------|----------|----------------|--------|
| POST | `/exams/{id}/answers` | `lib/api/exam-client.ts` - saveAnswer() | ✅ Used |

### Role-Based Access (2/2 implemented)

| Method | Endpoint | Frontend Usage | Status |
|--------|----------|----------------|--------|
| GET | `/teacher/exams` | `lib/api/exam-client.ts` - getTeacherExams() | ✅ Used |
| GET | `/student/exams` | `lib/api/exam-client.ts` - getStudentExams() | ✅ Used |

---

## ⚠️ NEW: Notes API (Not in API_ENDPOINTS.md)

These endpoints were added for the notes management feature but are **NOT in the backend documentation**:

| Method | Endpoint | Frontend File | Backend Status |
|--------|----------|---------------|----------------|
| POST | `/api/notes/upload` | `lib/api/notes-client.ts` | ❌ **NOT in backend** |
| GET | `/api/notes` | `lib/api/notes-client.ts` | ❌ **NOT in backend** |
| GET | `/api/notes/:id/download` | `lib/api/notes-client.ts` | ❌ **NOT in backend** |
| PUT | `/api/notes/:id` | `lib/api/notes-client.ts` | ❌ **NOT in backend** |
| DELETE | `/api/notes/:id` | `lib/api/notes-client.ts` | ❌ **NOT in backend** |
| GET | `/api/notes/subjects` | `lib/api/notes-client.ts` | ❌ **NOT in backend** |
| GET | `/api/notes/class-grades` | `lib/api/notes-client.ts` | ❌ **NOT in backend** |

**Total: 7 new endpoints needed in backend**

---

## Recommendations

### High Priority - Notes API
The **Notes Management** feature requires 7 new backend endpoints to be implemented:

1. **POST** `/api/notes/upload` - Upload note with file (multipart/form-data)
2. **GET** `/api/notes` - List notes with filters
3. **GET** `/api/notes/:id/download` - Get download URL
4. **PUT** `/api/notes/:id` - Update note metadata
5. **DELETE** `/api/notes/:id` - Delete note
6. **GET** `/api/notes/subjects` - Get available subjects
7. **GET** `/api/notes/class-grades` - Get available class grades

### Medium Priority - Question Management
Consider implementing bulk operations for better UX:

1. **GET** `/exams/{id}/questions` - Get all questions at once (more efficient than individual fetches)
2. **POST** `/exams/{id}/questions/objective/bulk` - Bulk create MCQ questions
3. **POST** `/exams/{id}/questions/theory/upload` - Bulk upload theory questions

### Low Priority - Technician Monitoring
These are nice-to-have for system monitoring:

1. **GET** `/metrics` - Application metrics
2. **GET** `/technician/system/health` - Detailed system health
3. **GET** `/technician/system/diagnostics` - Diagnostic information
4. **GET** `/technician/system/logs` - System logs

---

## Files Referencing Backend APIs

### API Clients
- `lib/api/auth-client.ts` - Authentication
- `lib/api/admin-client.ts` - Admin operations
- `lib/api/exam-client.ts` - Exam management
- `lib/api/notes-client.ts` - Notes management (NEW - needs backend)
- `lib/api/client.ts` - Generic exam API client

### Next.js API Routes (Proxies)
- `app/api/admin/users/route.ts` - Proxies admin user operations
- `app/api/admin/users/[id]/role/route.ts` - Proxies role updates
- `app/api/admin/audit-logs/route.ts` - Proxies audit logs
- `app/api/technician/metrics/route.ts` - Proxies metrics
- `app/api/technician/rbac-policies/route.ts` - Proxies RBAC policies
- `app/api/teachers/live-classes/route.ts` - Live classes CRUD

### Pages Using APIs
- `app/login/page.tsx` - Authentication
- `app/admin/users/page.tsx` - User management
- `app/admin/subjects/page.tsx` - Subject management
- `app/teachers/exams/create/page.tsx` - Create exam
- `app/teachers/exams/setup/page.tsx` - Exam setup
- `app/exams/midterm/page.tsx` - Exam listing
- `app/exams/objective/page.tsx` - Objective exams
- `app/exams/theory/page.tsx` - Theory exams
- `app/objective-exam/page.tsx` - MCQ exam taking
- `app/theory-exam/page.tsx` - Theory exam taking
- `app/technician/dashboard/page.tsx` - Technician dashboard
- `app/notes/page.tsx` - Student notes (NEW - needs backend)
- `app/teachers/notes/upload/page.tsx` - Teacher notes upload (NEW - needs backend)
