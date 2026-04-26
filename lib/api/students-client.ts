import { axios } from '@/lib/axios-shim'
import { getAuthToken } from './auth-config'

const API_BASE_URL = '/api'

function getAxiosConfig() {
  const token = getAuthToken()
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  }
}

export interface Student {
  id: string
  userId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  admissionNumber: string
  classId?: string
  className?: string
  status: 'active' | 'inactive' | 'transferred' | 'graduated'
  createdAt: string
  updatedAt: string
}

export interface CreateStudentRequest {
  firstName: string
  lastName: string
  email: string
  phone?: string
  admissionNumber: string
  classId?: string
}

export interface TransferHistory {
  id: string
  studentId: string
  fromClassId: string
  fromClassName: string
  toClassId: string
  toClassName: string
  transferredAt: string
  transferredBy: string
}

export async function getStudents(filters?: {
  classId?: string
  status?: string
  search?: string
  page?: number
  limit?: number
}): Promise<{ data: Student[]; pagination?: any }> {
  const params = new URLSearchParams()
  if (filters?.classId) params.append('classId', filters.classId)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await axios.get<{ data: Student[]; pagination?: any }>(
    `${API_BASE_URL}/students?${params}`,
    getAxiosConfig()
  )
  return response.data
}

export async function getStudentById(id: string): Promise<Student> {
  const response = await axios.get<{ data: Student }>(
    `${API_BASE_URL}/students/${id}`,
    getAxiosConfig()
  )
  return response.data.data
}

export async function getStudentTransferHistory(studentId: string): Promise<{ data: TransferHistory[] }> {
  const response = await axios.get<{ data: TransferHistory[] }>(
    `${API_BASE_URL}/students/${studentId}/history`,
    getAxiosConfig()
  )
  return response.data
}

export async function createStudent(data: CreateStudentRequest): Promise<Student> {
  const response = await axios.post<{ data: Student }>(
    `${API_BASE_URL}/students`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function updateStudent(id: string, data: Partial<CreateStudentRequest>): Promise<Student> {
  const response = await axios.patch<{ data: Student }>(
    `${API_BASE_URL}/students/${id}`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function deleteStudent(id: string): Promise<void> {
  await axios.delete(
    `${API_BASE_URL}/students/${id}`,
    getAxiosConfig()
  )
}

export async function enrollStudent(studentId: string, classId: string): Promise<Student> {
  const response = await axios.post<{ data: Student }>(
    `${API_BASE_URL}/students/${studentId}/enroll`,
    { classId },
    getAxiosConfig()
  )
  return response.data.data
}

export async function transferStudent(studentId: string, toClassId: string): Promise<Student> {
  const response = await axios.post<{ data: Student }>(
    `${API_BASE_URL}/students/${studentId}/transfer`,
    { toClassId },
    getAxiosConfig()
  )
  return response.data.data
}

export async function bulkPromoteStudents(data: {
  fromClassId: string
  toClassId: string
  academicYearId: string
}): Promise<{ promoted: number; failed: string[] }> {
  const response = await axios.post<{ data: { promoted: number; failed: string[] } }>(
    `${API_BASE_URL}/students/promote`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}