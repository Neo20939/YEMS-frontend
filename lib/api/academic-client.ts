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
  startDate: string
  endDate: string
}

export interface UpdateTermRequest {
  name?: string
  startDate?: string
  endDate?: string
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

// Class
export interface AcademicClass {
  id: string
  name: string
  classLevelId: string
  departmentId?: string
  academicYearId: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateClassRequest {
  name: string
  classLevelId: string
  departmentId?: string
  academicYearId: string
}

export interface UpdateClassRequest {
  name?: string
  classLevelId?: string
  departmentId?: string
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

export async function getAcademicYears(): Promise<AcademicYear[]> {
  const response = await apiClient.get<AcademicYear[]>('academic/academic-years')
  return response.data
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
  const response = await apiClient.post<AcademicYear>('academic/academic-years', data)
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
  const response = await apiClient.get<Term[]>('academic/terms')
  return response.data
}

export async function getTerm(id: string): Promise<Term> {
  const response = await apiClient.get<Term>(`academic/terms/${id}`)
  return response.data
}

export async function createTerm(data: CreateTermRequest): Promise<Term> {
  const response = await apiClient.post<Term>('academic/terms', data)
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

export async function getClasses(): Promise<AcademicClass[]> {
  const response = await apiClient.get<AcademicClass[]>('academic/classes')
  return response.data
}

export async function getClass(id: string): Promise<AcademicClass> {
  const response = await apiClient.get<AcademicClass>(`academic/classes/${id}`)
  return response.data
}

export async function createClass(data: CreateClassRequest): Promise<AcademicClass> {
  const response = await apiClient.post<AcademicClass>('academic/classes', data)
  return response.data
}

export async function updateClass(id: string, data: UpdateClassRequest): Promise<AcademicClass> {
  const response = await apiClient.patch<AcademicClass>(`academic/classes/${id}`, data)
  return response.data
}

export async function deleteClass(id: string): Promise<void> {
  await apiClient.delete(`academic/classes/${id}`)
}

// ============================================================================
// Subjects
// ============================================================================

export async function getSubjects(): Promise<AcademicSubject[]> {
  const response = await apiClient.get<AcademicSubject[]>('academic/subjects')
  return response.data
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
  const response = await apiClient.get<TeacherSubjectAssignment[]>('academic/teacher-subject-assignments')
  return response.data
}

export async function getTeacherSubjectAssignment(id: string): Promise<TeacherSubjectAssignment> {
  const response = await apiClient.get<TeacherSubjectAssignment>(`academic/teacher-subject-assignments/${id}`)
  return response.data
}

export async function createTeacherSubjectAssignment(data: CreateTeacherSubjectAssignmentRequest): Promise<TeacherSubjectAssignment> {
  const response = await apiClient.post<TeacherSubjectAssignment>('academic/teacher-subject-assignments', data)
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
