# Academic API Implementation Status

## Summary

This document tracks which backend academic APIs are **actually implemented** vs which are **only in the frontend code** but return 404.

---

## ✅ Backend APIs That WORK

### 1. Academic Years
- `GET /api/academic/academic-years` ✅

### 2. Class Levels
- `GET /api/academic/class-levels` ✅

### 3. Departments
- `GET /api/academic/departments` ✅

### 4. Classes - Basic CRUD
- `GET /api/academic/classes` ✅ (with filters: page, limit, classLevelId, departmentId, academicYearId)
- `GET /api/academic/classes/:id` ✅
- `POST /api/academic/classes` ✅ (requires: class_name, classLevelId, academicYearId; optional: departmentId, capacity)
- `PUT /api/academic/classes/:id` ✅
- `DELETE /api/academic/classes/:id` ✅

### 5. Subjects
- `GET /api/academic/subjects` ✅ (with pagination)
- `POST /api/academic/subjects` ✅ (requires: name, code; optional: description, isGeneral)
- `GET /api/academic/subjects/:id` ✅
- `PUT /api/academic/subjects/:id` ✅
- `DELETE /api/academic/subjects/:id` ✅

### 6. Users
- `GET /api/users` ✅ (returns all users with roles)

---

## ❌ Backend APIs That Return 404 (NOT Implemented)

The following endpoints are **defined in `lib/classService.ts`** but **DO NOT EXIST** in the backend:

### Class Details & Nested Resources
- `GET /api/academic/classes/:id/details` ❌
- `GET /api/academic/classes/:id/students` ❌
- `GET /api/academic/classes/:id/subjects` ❌

### Class Subject Management
- `POST /api/academic/classes/:id/subjects` ❌
- `PUT /api/academic/classes/:id/subjects/:subjectId` ❌
- `DELETE /api/academic/classes/:id/subjects/:subjectId` ❌

### Timetable
- `GET /api/academic/classes/:id/timetable` ❌
- `POST /api/academic/classes/:id/timetable` ❌
- `PUT /api/academic/classes/:id/timetable/:slotId` ❌
- `DELETE /api/academic/classes/:id/timetable/:slotId` ❌
- `POST /api/academic/classes/:id/timetable/validate` ❌
- `POST /api/academic/classes/:id/timetable/generate` ❌

### Enrollment
- `POST /api/academic/classes/:id/enrollments` ❌
- `GET /api/academic/classes/:id/enrollments` ❌
- `DELETE /api/academic/classes/:id/enrollments/:studentId` ❌
- `POST /api/academic/classes/:id/enroll/bulk` ❌
- `POST /api/academic/classes/:id/enroll/import-csv` ❌

### Activity History
- `GET /api/academic/classes/:id/history` ❌

### Archive/Duplicate
- `PATCH /api/academic/classes/:id/archive` ❌
- `POST /api/academic/classes/:id/duplicate` ❌

### Export
- `GET /api/academic/classes/export` ❌
- `GET /api/academic/classes/:id/students/export` ❌
- `GET /api/academic/classes/:id/timetable/export` ❌

---

## Frontend Code Issues

### `lib/classService.ts`
This file calls all the endpoints above that return 404. **These functions will throw errors** when used:

```typescript
// These will FAIL with 404:
getClassDetails(classId)
getClassStudents(classId)
addSubjectToClass(classId, input)
getClassSubjects(classId)
updateClassSubject(classId, subjectId, input)
removeSubjectFromClass(classId, subjectId)
getTimetable(classId)
addTimetableSlot(classId, input)
updateTimetableSlot(classId, slotId, input)
deleteTimetableSlot(classId, slotId)
enrollStudent(classId, input)
getClassEnrollments(classId)
removeStudentFromClass(classId, studentId)
bulkEnrollStudents(classId, enrollments)
importEnrollmentsFromCSV(classId, file)
getClassHistory(classId)
```

### `hooks/useClasses.ts`
This hook uses `classService` and will fail when calling the above methods.

### Components
- `ClassFormModal.tsx` - Uses hardcoded levels/streams instead of API
- `ClassesListPage.tsx` - Uses mock teachers data
- `ClassDetailsPage.tsx` - Will fail when trying to fetch class details

---

## What Actually Works in Frontend

### Working Features
1. **List Classes** - `getClasses()` with filters ✅
2. **Create Class** - `createClass()` with correct payload ✅
3. **Update Class** - `updateClass()` ✅
4. **Delete Class** - `deleteClass()` ✅
5. **List Subjects** - `getSubjects()` ✅
6. **Create Subject** - `createSubject()` ✅
7. **Update Subject** - `updateSubject()` ✅
8. **Delete Subject** - `deleteSubject()` ✅
9. **Get Academic Years** - `getAcademicYears()` ✅
10. **Get Class Levels** - `getClassLevels()` in admin-client.ts ✅
11. **Get Departments** - `getDepartments()` in admin-client.ts ✅

### Non-Working Features
1. **Class Details Page** - Returns 404 ❌
2. **Manage Class Subjects** - Returns 404 ❌
3. **Timetable Management** - Returns 404 ❌
4. **Student Enrollment** - Returns 404 ❌
5. **Bulk Operations** - Returns 404 ❌

---

## Required Backend Implementation

To make the frontend fully functional, the backend needs to implement:

### Priority 1 (Core Functionality)
1. `GET /api/academic/classes/:id/details` - Return class with students, subjects, timetable
2. `GET /api/academic/classes/:id/students` - List enrolled students
3. `POST /api/academic/classes/:id/enrollments` - Enroll student
4. `DELETE /api/academic/classes/:id/enrollments/:studentId` - Remove student

### Priority 2 (Subject Management)
1. `GET /api/academic/classes/:id/subjects` - List class subjects
2. `POST /api/academic/classes/:id/subjects` - Add subject to class
3. `DELETE /api/academic/classes/:id/subjects/:subjectId` - Remove subject

### Priority 3 (Timetable)
1. `GET /api/academic/classes/:id/timetable` - Get timetable
2. `POST /api/academic/classes/:id/timetable` - Add slot
3. `DELETE /api/academic/classes/:id/timetable/:slotId` - Delete slot

### Priority 4 (Nice to Have)
- Archive/duplicate endpoints
- Export endpoints
- Bulk enrollment
- Activity history

---

## Recommended Frontend Fixes

### 1. Update `classService.ts` to Handle 404s

```typescript
async getClassDetails(classId: string): Promise<ClassDetails> {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/api/academic/classes/${classId}/details`);
    return handleResponse(response);
  } catch (error) {
    // Fallback: fetch class, students, subjects separately
    const [classData, students, subjects, timetable] = await Promise.all([
      getClassById(classId),
      getClassStudents(classId).catch(() => []),
      getClassSubjects(classId).catch(() => []),
      getTimetable(classId).catch(() => []),
    ]);
    return { class: classData, students, subjects, timetable };
  }
}
```

### 2. Update `ClassFormModal.tsx` to Use API

```typescript
import { academicApi } from '@/lib/api/admin-client'

// Fetch levels, departments, years from API
const [levels, setLevels] = useState([])
const [departments, setDepartments] = useState([])
const [years, setYears] = useState([])

useEffect(() => {
  Promise.all([
    academicApi.getClassLevels(),
    academicApi.getDepartments(),
    academicApi.getAcademicYears(),
  ]).then(([levels, depts, years]) => {
    setLevels(levels)
    setDepartments(depts)
    setYears(years)
  })
}, [])
```

---

## Test Results

Tested with curl:

```bash
# ✅ Works
GET /api/academic/classes
GET /api/academic/classes/acf41c54-ee7a-499f-bbf8-4c8bf650556a
POST /api/academic/classes (with classLevelId, academicYearId)

# ❌ Returns 404
GET /api/academic/classes/acf41c54-ee7a-499f-bbf8-4c8bf650556a/students
GET /api/academic/classes/acf41c54-ee7a-499f-bbf8-4c8bf650556a/subjects
GET /api/academic/classes/acf41c54-ee7a-499f-bbf8-4c8bf650556a/timetable
```

---

## Conclusion

**Frontend Status:** ~40% of academic API functions are backed by working endpoints.

**What Works:**
- Basic class CRUD
- Subject CRUD
- Fetching academic years, levels, departments

**What Doesn't Work:**
- Class details page
- Subject assignment to classes
- Timetable management
- Student enrollment
- Any nested class resources

**Next Steps:**
1. Backend needs to implement nested endpoints for classes
2. Frontend needs better error handling for 404s
3. Components need to use API data instead of hardcoded values
