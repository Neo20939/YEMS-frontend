/**
 * Academic API Client
 *
 * Handles academic structure operations: years, terms, classes, subjects, etc.
 */

import { axios } from '@/lib/axios-shim'
import { getAuthToken } from './auth-config'

// ============================================================================
// Types
// ============================================================================

// Academic Year
export interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateAcademicYearRequest {
  name: string
  startDate: string
  endDate: string
}

export interface UpdateAcademicYearRequest {
  name?: string
  startDate?: string
  endDate?: string
}

// Term
export interface Term {
  id: string
  name: string
  academicYearId: string
  startDate: string
  endDate: string
  isCurrent: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateTermRequest {
  name: string
  academicYearId: string
  termNumber: number
  startDate: string
  endDate: string
}

export interface UpdateTermRequest {
  name?: string
  termNumber?: number
}

// Class Level
export interface ClassLevel {
  id: string
  name: string
  level: number
  category: 'JS' | 'SS'
}

// Department
export interface Department {
  id: string
  name: string
  code: string
}

// Class (frontend view model - maps backend AcademicClass to UI type)
export interface Class {
  id: string
  class_name: string
  class_code: string
  level: string
  stream?: string
  academic_year: string
  max_capacity: number
  form_teacher_id?: string
  form_teacher_name?: string
  status: 'active' | 'archived'
  enrolled_count?: number
  student_count?: number
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  // raw backend fields also available
  classLevelId?: string
  departmentId?: string
  academicYearId?: string
}

// Backend AcademicClass (as returned by the API)
export interface AcademicClass {
  id: string
  name: string
  classLevelId: string
  classLevelName?: string
  departmentId?: string
  departmentName?: string
  academicYearId?: string
  academicYearName?: string
  capacity?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  level?: string
  enrolledCount?: number
}

// Re-export for backward compatibility
export type { AcademicClass as AcademicClassRaw }

export interface CreateClassRequest {
  name?: string
  arm?: string
  classLevelId: string
  departmentId?: string
  academicYearId: string
  capacity?: number
}

export interface UpdateClassRequest {
  name?: string
  arm?: string
  classLevelId?: string
  departmentId?: string
  capacity?: number
  isActive?: boolean
}

// Subject
export interface AcademicSubject {
  id: string
  name: string
  code: string
  description?: string
  departmentId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateSubjectRequest {
  name: string
  code: string
  description?: string
  departmentId?: string
}

export interface UpdateSubjectRequest {
  name?: string
  code?: string
  description?: string
}

// Teacher Subject Assignment
export interface TeacherSubjectAssignment {
  id: string
  teacherId: string
  classId: string
  subjectId: string
  academicYearId: string
  teacherName?: string
  className?: string
  subjectName?: string
  createdAt?: string
}

export interface CreateTeacherSubjectAssignmentRequest {
  teacherId: string
  classId: string
  subjectId: string
  academicYearId: string
}

// Class Teacher Assignment
export interface ClassTeacherAssignment {
  id: string
  teacherId: string
  classId: string
  academicYearId: string
  teacherName?: string
  className?: string
  createdAt?: string
}

export interface CreateClassTeacherAssignmentRequest {
  teacherId: string
  classId: string
  academicYearId: string
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  code?: string
  message: string
  status?: number
  details?: Record<string, string[]>
}

// ============================================================================
// API Client Setup
// ============================================================================

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.error('[Academic API] Error:', error.message)
    return Promise.reject(error)
  }
)

// ============================================================================
// Academic Years
// ============================================================================

export async function getAcademicYears(): Promise<{ data: AcademicYear[]; pagination?: any }> {
  const response = await apiClient.get<{ success: boolean; data: AcademicYear[]; pagination?: any }>('academic/academic-years')
  // Handle wrapped response
  if (response.data.success !== undefined) {
    return { data: response.data.data || [], pagination: response.data.pagination }
  }
  return { data: Array.isArray(response.data) ? response.data : [] }
}

export async function getAcademicYear(id: string): Promise<AcademicYear> {
  const response = await apiClient.get<AcademicYear>(`academic/academic-years/${id}`)
  return response.data
}

export async function getCurrentAcademicYear(): Promise<AcademicYear> {
  const response = await apiClient.get<AcademicYear>('academic/academic-years/current')
  return response.data
}

export async function createAcademicYear(data: CreateAcademicYearRequest): Promise<AcademicYear> {
  console.log('[createAcademicYear] Sending request with data:', JSON.stringify(data));
  const response = await apiClient.post<any>('academic/academic-years', data)
  console.log('[createAcademicYear] Response status:', response.status);
  console.log('[createAcademicYear] Response data:', JSON.stringify(response.data));
  return response.data
}

export async function updateAcademicYear(id: string, data: UpdateAcademicYearRequest): Promise<AcademicYear> {
  const response = await apiClient.patch<AcademicYear>(`academic/academic-years/${id}`, data)
  return response.data
}

export async function deleteAcademicYear(id: string): Promise<void> {
  await apiClient.delete(`academic/academic-years/${id}`)
}

export async function getAcademicYearTerms(academicYearId: string): Promise<Term[]> {
  const response = await apiClient.get<Term[]>(`academic/academic-years/${academicYearId}/terms`)
  return response.data
}

export async function setCurrentAcademicYear(id: string): Promise<AcademicYear> {
  const response = await apiClient.post<AcademicYear>(`academic/academic-years/${id}/set-current`)
  return response.data
}

// ============================================================================
// Terms
// ============================================================================

export async function getTerms(): Promise<Term[]> {
  const response = await apiClient.get<any>('academic/terms')
  // Handle different response formats from backend
  let termData: Term[] = []
  
  // Case 1: { success: true, data: [...] }
  if (response.data.success === true && Array.isArray(response.data.data)) {
    termData = response.data.data
  }
  // Case 2: { data: [...] }
  else if (response.data.data && Array.isArray(response.data.data)) {
    termData = response.data.data
  }
  // Case 3: [...] direct array
  else if (Array.isArray(response.data)) {
    termData = response.data
  }
  
  console.log('[getTerms] Parsed:', termData.length, 'terms')
  return termData
}

export async function getTerm(id: string): Promise<Term> {
  const response = await apiClient.get<Term>(`academic/terms/${id}`)
  return response.data
}

export async function createTerm(data: CreateTermRequest): Promise<Term> {
  console.log('[createTerm] Sending request with data:', JSON.stringify(data));
  const response = await apiClient.post<any>('academic/terms', data)
  console.log('[createTerm] Response status:', response.status);
  console.log('[createTerm] Response data:', JSON.stringify(response.data));
  return response.data
}

export async function updateTerm(id: string, data: UpdateTermRequest): Promise<Term> {
  const response = await apiClient.patch<Term>(`academic/terms/${id}`, data)
  return response.data
}

export async function deleteTerm(id: string): Promise<void> {
  await apiClient.delete(`academic/terms/${id}`)
}

export async function setCurrentTerm(id: string): Promise<Term> {
  const response = await apiClient.post<Term>(`academic/terms/${id}/set-current`)
  return response.data
}

// ============================================================================
// Class Levels
// ============================================================================

export async function getClassLevels(): Promise<ClassLevel[]> {
  const response = await apiClient.get<ClassLevel[]>('academic/class-levels')
  return response.data
}

// ============================================================================
// Departments
// ============================================================================

export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get<Department[]>('academic/departments')
  return response.data
}

// ============================================================================
// Classes
// ============================================================================

/**
 * Transform a raw backend AcademicClass to the frontend Class view model
 */
function toClass(b: AcademicClass): Class {
  // Backend returns name=classLevelName, so use that directly as class name
  // Also use classLevelName and academicYearName when available
  const name = b.name || b.classLevelName || ''
  const code = name
    .split(' ')
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3))
    .join('')
    .toUpperCase()
    .slice(0, 8)
  
  // Use level name from backend if available
  const level = b.classLevelName || b.level || ''
  
  return {
    id: b.id,
    class_name: name,
    class_code: code,
    level: level,
    stream: undefined,
    academic_year: b.academicYearName || '',
    max_capacity: b.capacity || 0,
    form_teacher_id: undefined,
    form_teacher_name: undefined,
    status: b.isActive ? 'active' : 'archived',
    enrolled_count: b.enrolledCount || 0,
    student_count: b.enrolledCount || 0,
    created_at: b.createdAt || new Date().toISOString(),
    updated_at: b.updatedAt || new Date().toISOString(),
    // raw
    classLevelId: b.classLevelId,
    departmentId: b.departmentId,
    academicYearId: b.academicYearId,
  }
}

export async function getClasses(params?: { limit?: number; page?: number }): Promise<{ data: Class[]; pagination?: any }> {
  const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
  const response = await apiClient.get<{ success: boolean; data: AcademicClass[]; pagination?: any }>(`academic/classes${queryString}`)
  // Handle wrapped response
  let raw: AcademicClass[] = []
  if (response.data.success !== undefined && Array.isArray(response.data.data)) {
    raw = response.data.data
  } else if (Array.isArray(response.data)) {
    raw = response.data
  }
  return {
    data: raw.map(toClass),
    pagination: response.data.pagination,
  }
}

export async function getClass(id: string): Promise<Class> {
  const response = await apiClient.get<AcademicClass>(`academic/classes/${id}`)
  return toClass(response.data)
}

export async function createClass(data: CreateClassRequest): Promise<Class> {
  const response = await apiClient.post<AcademicClass>('academic/classes', data)
  return toClass(response.data)
}

export async function updateClass(id: string, data: UpdateClassRequest): Promise<Class> {
  const response = await apiClient.patch<AcademicClass>(`academic/classes/${id}`, data)
  return toClass(response.data)
}

export async function deleteClass(id: string): Promise<void> {
  await apiClient.delete(`academic/classes/${id}`)
}

// ============================================================================
// Subjects
// ============================================================================

export async function getSubjects(): Promise<AcademicSubject[]> {
  const response = await apiClient.get<any>('academic/subjects')
  // Handle different response formats from backend
  let subjectData: AcademicSubject[] = []
  
  // Case 1: { success: true, data: [...] }
  if (response.data.success === true && Array.isArray(response.data.data)) {
    subjectData = response.data.data
  }
  // Case 2: { data: [...] }
  else if (response.data.data && Array.isArray(response.data.data)) {
    subjectData = response.data.data
  }
  // Case 3: [...] direct array
  else if (Array.isArray(response.data)) {
    subjectData = response.data
  }
  // Case 4: { results: [...] }
  else if (response.data.results && Array.isArray(response.data.results)) {
    subjectData = response.data.results
  }
  
  console.log('[academic getSubjects] Parsed:', subjectData.length, 'subjects')
  return subjectData
}

export async function getSubject(id: string): Promise<AcademicSubject> {
  const response = await apiClient.get<AcademicSubject>(`academic/subjects/${id}`)
  return response.data
}

export async function createSubject(data: CreateSubjectRequest): Promise<AcademicSubject> {
  const response = await apiClient.post<AcademicSubject>('academic/subjects', data)
  return response.data
}

export async function updateSubject(id: string, data: UpdateSubjectRequest): Promise<AcademicSubject> {
  const response = await apiClient.patch<AcademicSubject>(`academic/subjects/${id}`, data)
  return response.data
}

export async function deleteSubject(id: string): Promise<void> {
  await apiClient.delete(`academic/subjects/${id}`)
}

// ============================================================================
// Teacher Subject Assignments
// ============================================================================

export async function getTeacherSubjectAssignments(): Promise<TeacherSubjectAssignment[]> {
  const response = await apiClient.get<any>('academic/teacher-subject-assignments')
  // Handle different response formats
  let assignmentData: TeacherSubjectAssignment[] = []
  
  // Case 1: { success: true, data: [...] }
  if (response.data.success === true && Array.isArray(response.data.data)) {
    assignmentData = response.data.data
  }
  // Case 2: { data: [...] }
  else if (response.data.data && Array.isArray(response.data.data)) {
    assignmentData = response.data.data
  }
  // Case 3: [...] direct array
  else if (Array.isArray(response.data)) {
    assignmentData = response.data
  }
  // Case 4: { results: [...] }
  else if (response.data.results && Array.isArray(response.data.results)) {
    assignmentData = response.data.results
  }
  
  console.log('[getTeacherSubjectAssignments] Parsed:', assignmentData.length, 'assignments')
  return assignmentData
}

export async function getTeacherSubjectAssignment(id: string): Promise<TeacherSubjectAssignment> {
  const response = await apiClient.get<TeacherSubjectAssignment>(`academic/teacher-subject-assignments/${id}`)
  return response.data
}

export async function createTeacherSubjectAssignment(data: CreateTeacherSubjectAssignmentRequest): Promise<TeacherSubjectAssignment> {
  console.log('[createTeacherSubjectAssignment] Sending data:', JSON.stringify(data))
  const response = await apiClient.post<TeacherSubjectAssignment>('academic/teacher-subject-assignments', data)
  console.log('[createTeacherSubjectAssignment] Response:', response.data)
  return response.data
}

export async function deleteTeacherSubjectAssignment(id: string): Promise<void> {
  await apiClient.delete(`academic/teacher-subject-assignments/${id}`)
}

// ============================================================================
// Class Teacher Assignments
// ============================================================================

export async function getClassTeacherAssignments(): Promise<ClassTeacherAssignment[]> {
  const response = await apiClient.get<ClassTeacherAssignment[]>('academic/class-teacher-assignments')
  return response.data
}

export async function getClassTeacherAssignment(id: string): Promise<ClassTeacherAssignment> {
  const response = await apiClient.get<ClassTeacherAssignment>(`academic/class-teacher-assignments/${id}`)
  return response.data
}

export async function createClassTeacherAssignment(data: CreateClassTeacherAssignmentRequest): Promise<ClassTeacherAssignment> {
  const response = await apiClient.post<ClassTeacherAssignment>('academic/class-teacher-assignments', data)
  return response.data
}

export async function deleteClassTeacherAssignment(id: string): Promise<void> {
  await apiClient.delete(`academic/class-teacher-assignments/${id}`)
}

// ============================================================================
// Student Enrollment / Transfer
// ============================================================================

export interface EnrollStudentRequest {
  classId: string
  termId: string
  academicYearId?: string
}

export interface TransferStudentRequest {
  classId: string
  termId: string
  academicYearId?: string
}

/**
 * Enroll a student in a class - uses native fetch to avoid kiattp/axios async issues
 */
export async function enrollStudent(studentId: string, data: EnrollStudentRequest): Promise<any> {
  const response = await fetch('/api/admin/students/' + studentId + '/enroll', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error?.message || result.message || 'Failed to enroll student')
  }
  return result.data ?? result
}

/**
 * Transfer a student to another class - uses native fetch to avoid kiattp/axios async issues
 */
export async function transferStudent(studentId: string, data: TransferStudentRequest): Promise<any> {
  const response = await fetch('/api/admin/students/' + studentId + '/transfer', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.error?.message || result.message || 'Failed to transfer student')
  }
  return result.data ?? result
}
