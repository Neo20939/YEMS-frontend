import { axios } from '@/lib/axios-shim'
import { getAuthToken } from './auth-config'
import type { Class, StudentEnrollment } from '@/types/class'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

export interface ClassTeacherClass extends Class {
  studentCount: number
  averageGrade: number
  passRate: number
}

export interface StudentAcademicRecord {
  id: string
  studentId: string
  studentName: string
  admissionNo: string
  classId: string
  className: string
  subjects: Array<{
    subjectId: string
    subjectName: string
    score: number
    grade: string
    position: number
    remarks: string
  }>
  overallScore: number
  overallGrade: string
  overallPosition: number
  attendance: number
  term: string
  academicYear: string
}

export interface ClassAcademicSummary {
  classId: string
  className: string
  totalStudents: number
  averageScore: number
  passRate: number
  highestScore: number
  lowestScore: number
  subjectPerformances: Array<{
    subjectId: string
    subjectName: string
    averageScore: number
    passRate: number
  }>
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config: any) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function getTeacherClasses(teacherId: string): Promise<ClassTeacherClass[]> {
  try {
    const response: any = await apiClient.get(`api/academic/classes`, {
      params: { formTeacherId: teacherId, status: 'active' },
    })
    if (response.data.success) {
      return response.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch teacher classes:', error)
    return []
  }
}

export async function getClassStudents(classId: string): Promise<StudentEnrollment[]> {
  try {
    const response: any = await apiClient.get(`api/academic/classes/${classId}/students`)
    if (response.data.success) {
      return response.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch class students:', error)
    return []
  }
}

export async function getStudentAcademicRecord(
  studentId: string,
  classId: string
): Promise<StudentAcademicRecord | null> {
  try {
    const response: any = await apiClient.get(
      `api/academic/classes/${classId}/students/${studentId}/academic`
    )
    if (response.data.success) {
      return response.data.data
    }
    return null
  } catch (error) {
    console.error('Failed to fetch student academic record:', error)
    return null
  }
}

export async function getClassAcademicSummary(
  classId: string
): Promise<ClassAcademicSummary | null> {
  try {
    const response: any = await apiClient.get(
      `api/academic/classes/${classId}/academic-summary`
    )
    if (response.data.success) {
      return response.data.data
    }
    return null
  } catch (error) {
    console.error('Failed to fetch class academic summary:', error)
    return null
  }
}

export async function getClassStudentsWithAcademic(
  classId: string
): Promise<StudentAcademicRecord[]> {
  try {
    const response: any = await apiClient.get(
      `api/academic/classes/${classId}/students/academic`
    )
    if (response.data.success) {
      return response.data.data
    }
    return []
  } catch (error) {
    console.error('Failed to fetch students with academic data:', error)
    return []
  }
}

export const classTeacherApi = {
  getTeacherClasses,
  getClassStudents,
  getStudentAcademicRecord,
  getClassAcademicSummary,
  getClassStudentsWithAcademic,
}

export default classTeacherApi