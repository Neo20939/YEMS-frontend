# Backend API Implementation Guide

This document provides a complete reference for the backend APIs that have been implemented and integrated into the frontend.

## Base URL

```
https://kennedi-ungnostic-unconvulsively.ngrok-free.dev
```

All API endpoints are prefixed with `/api/`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Academic Management](#academic-management)
3. [Admin Users](#admin-users)
4. [Notes Management](#notes-management)
5. [Exam Management](#exam-management)
6. [Technician/Monitoring](#technicianmonitoring)

---

## Authentication

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user info |

### Usage

```typescript
import { login } from '@/lib/api/auth-client'

const response = await login({
  email: 'admin@yems.local',
  password: 'AdminPass123!',
})

// Response:
// {
//   user: { id, email, name, role, avatar },
//   accessToken: string,
//   refreshToken: string,
//   expiresIn: number,
//   tokenType: 'Bearer'
// }
```

---

## Academic Management

Base: `/api/academic/`

### Academic Years

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/academic/academic-years` | Get all academic years |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "TermsSort-mn5v59ou",
      "startDate": "2042-01-01T00:00:00.000Z",
      "endDate": "2042-12-31T00:00:00.000Z",
      "isCurrent": false,
      "schoolId": null,
      "createdAt": "2026-03-25T09:50:48.656Z",
      "updatedAt": "2026-03-31T17:49:35.394Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 416,
    "totalPages": 21
  }
}
```

### Class Levels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/academic/class-levels` | Get all class levels (JS1, JS2, JS3, SS1, SS2, SS3) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "JS1",
      "displayOrder": 1,
      "requiresDepartment": false,
      "createdAt": "2026-03-25T09:25:43.517Z"
    }
  ]
}
```

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/academic/departments` | Get all departments (Arts, Commercial, Science) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Arts",
      "createdAt": "2026-03-25T09:25:43.505Z"
    }
  ]
}
```

### Classes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/academic/classes` | List all classes (with filters) |
| GET | `/api/academic/classes/:id` | Get class by ID |
| POST | `/api/academic/classes` | Create new class |
| PUT | `/api/academic/classes/:id` | Update class |
| DELETE | `/api/academic/classes/:id` | Delete class |

#### Create Class Request

```json
{
  "class_name": "JS1 Science",
  "classLevelId": "uuid",
  "academicYearId": "uuid",
  "departmentId": "uuid",
  "capacity": 40
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "JS1",
    "classLevelId": "uuid",
    "classLevelName": "JS1",
    "departmentId": "uuid",
    "departmentName": "Science",
    "academicYearId": "uuid",
    "academicYearName": "TermsSort-mn5v59ou",
    "capacity": 40,
    "isActive": true,
    "schoolId": null,
    "createdAt": "2026-03-31T18:45:02.842Z",
    "updatedAt": "2026-03-31T18:45:02.842Z"
  }
}
```

#### Usage

```typescript
import { academicApi } from '@/lib/api/admin-client'

// Get class levels first
const levels = await academicApi.getClassLevels()

// Get departments
const departments = await academicApi.getDepartments()

// Get academic years
const years = await academicApi.getAcademicYears()

// Get classes with filters
const { classes, pagination } = await academicApi.getClasses({
  page: 1,
  limit: 20,
  classLevelId: 'uuid',
  departmentId: 'uuid',
  academicYearId: 'uuid',
  search: 'JS1',
})

// Create class
const newClass = await academicApi.createClass({
  class_name: 'JS1 Science',
  classLevelId: 'uuid',
  academicYearId: 'uuid',
  departmentId: 'uuid',
  capacity: 40,
})
```

### Subjects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/academic/subjects` | List all subjects |
| GET | `/api/academic/subjects/:id` | Get subject by ID |
| POST | `/api/academic/subjects` | Create new subject |
| PUT | `/api/academic/subjects/:id` | Update subject |
| DELETE | `/api/academic/subjects/:id` | Delete subject |

#### Create Subject Request

```json
{
  "name": "Mathematics",
  "code": "MATH-001",
  "description": "Mathematics subject",
  "isGeneral": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Mathematics",
    "code": "MATH-001",
    "description": "Mathematics subject",
    "isActive": true,
    "isGeneral": false,
    "createdAt": "2026-03-31T18:19:17.386Z",
    "updatedAt": "2026-03-31T18:19:17.386Z"
  }
}
```

#### Usage

```typescript
import { academicApi } from '@/lib/api/admin-client'

// Get subjects
const { subjects, pagination } = await academicApi.getAllSubjects({
  page: 1,
  limit: 20,
  search: 'Math',
  active: true,
})

// Create subject
const subject = await academicApi.createAcademicSubject({
  name: 'Mathematics',
  code: 'MATH-001',
  description: 'Mathematics subject',
  isGeneral: false,
})
```

---

## Admin Users

Base: `/api/admin/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:id` | Get user by ID |
| POST | `/api/admin/users` | Create new user |
| DELETE | `/api/admin/users/:id` | Delete user |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| PATCH | `/api/admin/users/:id/assign-subjects` | Assign subjects to teacher |

### Usage

```typescript
import { getUsers, createUser, updateUserRole, deleteUser } from '@/lib/api/admin-client'

// Get all users
const users = await getUsers()

// Create user
const newUser = await createUser({
  email: 'teacher@yems.local',
  name: 'John Teacher',
  password: 'Password123!',
  role: 'teacher',
})

// Update role
await updateUserRole(userId, 'platform_admin')

// Delete user
await deleteUser(userId)
```

---

## Notes Management

Base: `/api/notes`

**Status:** ✅ Backend endpoints exist and are functional

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | List all notes (with filters) |
| GET | `/api/notes/:id/download` | Get download URL for note |
| PUT | `/api/notes/:id` | Update note metadata |
| DELETE | `/api/notes/:id` | Delete note |
| GET | `/api/notes/subjects` | Get available subjects |
| GET | `/api/notes/class-grades` | Get available class grades |
| POST | `/api/notes/upload` | Upload new note (multipart/form-data) |

**Note:** The `/api/notes/class-grades` endpoint returns a UUID parse error - this is a backend bug that needs fixing.

### Upload Note Request

```
POST /api/notes/upload
Content-Type: multipart/form-data

file: <binary>
title: "Introduction to Algebra"
description: "Basic algebra concepts"
subject: "mathematics"
classGrade: "grade-10"
term: "first-term"
week: "01"
topic: "Algebra Basics"
tags: '["basics", "intro"]'
```

### Usage

```typescript
import { uploadNote, getNotes, downloadNote, deleteNote } from '@/lib/api/notes-client'

// Upload note
const result = await uploadNote({
  title: 'Introduction to Algebra',
  description: 'Basic algebra concepts',
  subject: 'mathematics',
  classGrade: 'grade-10',
  term: 'first-term',
  week: '01',
  topic: 'Algebra Basics',
  tags: ['basics', 'intro'],
  file: selectedFile,
}, (progress) => {
  console.log(`Upload progress: ${progress}%`)
})

// Get notes with filters
const notes = await getNotes({
  subject: 'mathematics',
  classGrade: 'grade-10',
  term: 'first-term',
  search: 'algebra',
}, {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
})

// Download note
await triggerFileDownload(noteId, fileName)

// Delete note
await deleteNote(noteId)
```

---

## Exam Management

Base: `/exams`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/exams/` | List all exams |
| POST | `/exams` | Create new exam |
| GET | `/exams/type/:type` | Get exams by type |
| GET | `/exams/:id` | Get exam by ID |
| POST | `/exams/start` | Start exam session |
| POST | `/exams/submit` | Submit exam |
| GET | `/exams/:id/progress/:studentId` | Get student progress |
| POST | `/exams/:id/questions` | Create question |
| GET | `/exams/:id/questions/:questionId` | Get question |
| PUT | `/exams/:id/questions/:questionId` | Update question |
| DELETE | `/exams/:id/questions/:questionId` | Delete question |
| POST | `/exams/:id/answers` | Save answer |

### Usage

```typescript
import { getExams, startExam, saveAnswer, submitExam } from '@/lib/api/exam-client'

// Get exams
const exams = await getExams()

// Start exam
const session = await startExam(examId, studentId)

// Save answer
await saveAnswer(examId, {
  questionId: 'uuid',
  answerText: 'My answer',
  selectedOptionIds: ['option-a'],
  isDraft: true,
})

// Submit exam
await submitExam(examId, studentId, answers)
```

---

## Technician/Monitoring

### System Metrics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/status/metrics` | Get system metrics |
| GET | `/health` | Health check |
| GET | `/technician/rbac/policies` | Get RBAC policies |

### Usage

```typescript
import { monitoringApi } from '@/lib/api/monitoring-client'

// Get system metrics
const metrics = await monitoringApi.getSystemMetrics()

// Get health
const health = await monitoringApi.getSystemHealth()

// Get RBAC policies
const policies = await monitoringApi.getRbacPolicies()
```

---

## Frontend API Clients

### Available Clients

| Client | File | Description |
|--------|------|-------------|
| Auth | `lib/api/auth-client.ts` | Authentication |
| Admin | `lib/api/admin-client.ts` | Admin operations + Academic API |
| Exam | `lib/api/exam-client.ts` | Exam management |
| Notes | `lib/api/notes-client.ts` | Notes management |
| Monitoring | `lib/api/monitoring-client.ts` | System monitoring |
| Class Service | `lib/classService.ts` | Class/subject management |

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=https://kennedi-ungnostic-unconvulsively.ngrok-free.dev
NEXT_PUBLIC_API_KEY=your-api-key-here
```

---

## Authentication

All API endpoints (except login) require authentication via Bearer token:

```
Authorization: Bearer <access_token>
```

Tokens are automatically added to requests by the API clients from `localStorage`.

---

## Error Handling

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": ["Field is required"]
    }
  }
}
```

---

## Notes

### Backend Implementation Status

✅ **Implemented and Working:**
- Academic Years (GET `/api/academic/academic-years`)
- Class Levels (GET `/api/academic/class-levels`) - Returns JS1, JS2, JS3, SS1, SS2, SS3
- Departments (GET `/api/academic/departments`) - Returns Arts, Commercial, Science
- Classes (CRUD - GET, POST, PUT, DELETE `/api/academic/classes`)
- Subjects (CRUD - GET, POST, PUT, DELETE `/api/academic/subjects`)
- Users (GET `/api/users` - returns all users with roles)
- Notes (CRUD + upload/download - `/api/notes`)
- Exams (CRUD + questions, answers - `/exams`)
- Monitoring (metrics, health, RBAC - `/status/metrics`, `/health`, `/technician/rbac/policies`)

⚠️ **Partially Implemented:**
- Class students, subjects, timetable endpoints return 404 (not yet implemented in backend)
- Class enrollment endpoints not implemented
- `/api/notes/class-grades` returns UUID parse error (backend bug)

❌ **Needs Implementation:**
- Accountant Portal APIs (50+ endpoints)
- Theory marking queue endpoints
- Bulk question upload endpoints

### Known Issues

1. **`/api/notes/class-grades`** - Returns "invalid input syntax for type uuid: class-grades" error
   - **Workaround:** Use hardcoded class grades in frontend

2. **Class creation requires specific IDs:**
   - Must fetch `classLevelId` from `/api/academic/class-levels` first
   - Must fetch `academicYearId` from `/api/academic/academic-years` first
   - Optionally fetch `departmentId` from `/api/academic/departments` for SS classes

3. **Nested class endpoints not implemented:**
   - `/api/academic/classes/:id/students` - Returns 404
   - `/api/academic/classes/:id/subjects` - Returns 404
   - `/api/academic/classes/:id/timetable` - Returns 404
   - `/api/academic/classes/:id/enrollments` - Returns 404
