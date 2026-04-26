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

export interface AttendanceSession {
  id: string
  classId: string
  className?: string
  subjectId?: string
  subjectName?: string
  date: string
  startTime: string
  endTime: string
  recordedBy: string
  recordedByName?: string
  totalStudents: number
  presentCount: number
  absentCount: number
  createdAt: string
}

export interface AttendanceRecord {
  id: string
  sessionId: string
  studentId: string
  studentName?: string
  status: 'present' | 'absent' | 'late' | 'excused'
  remarks?: string
  recordedAt: string
}

export interface CreateSessionRequest {
  classId: string
  subjectId?: string
  date: string
  startTime: string
  endTime: string
}

export interface UpdateSessionRequest {
  endTime?: string
  status?: 'active' | 'closed'
}

export interface MarkAttendanceRequest {
  studentId: string
  status: 'present' | 'absent' | 'late' | 'excused'
  remarks?: string
}

export async function getAttendanceSessions(filters?: {
  classId?: string
  date?: string
  startDate?: string
  endDate?: string
}): Promise<{ data: AttendanceSession[]; pagination?: any }> {
  const params = new URLSearchParams()
  if (filters?.classId) params.append('classId', filters.classId)
  if (filters?.date) params.append('date', filters.date)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const response = await axios.get<{ data: AttendanceSession[]; pagination?: any }>(
    `${API_BASE_URL}/attendance/sessions?${params}`,
    getAxiosConfig()
  )
  return response.data
}

export async function getClassAttendance(classId: string, date: string): Promise<{
  session: AttendanceSession
  records: AttendanceRecord[]
}> {
  const response = await axios.get<{ data: { session: AttendanceSession; records: AttendanceRecord[] } }>(
    `${API_BASE_URL}/attendance/classes/${classId}?date=${date}`,
    getAxiosConfig()
  )
  return response.data.data
}

export async function getStudentAttendanceHistory(studentId: string): Promise<{ data: AttendanceRecord[] }> {
  const response = await axios.get<{ data: AttendanceRecord[] }>(
    `${API_BASE_URL}/attendance/students/${studentId}/history`,
    getAxiosConfig()
  )
  return response.data
}

export async function createAttendanceSession(data: CreateSessionRequest): Promise<AttendanceSession> {
  const response = await axios.post<{ data: AttendanceSession }>(
    `${API_BASE_URL}/attendance/sessions`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function updateAttendanceSession(
  sessionId: string,
  data: UpdateSessionRequest
): Promise<AttendanceSession> {
  const response = await axios.patch<{ data: AttendanceSession }>(
    `${API_BASE_URL}/attendance/sessions/${sessionId}`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function markAttendance(
  sessionId: string,
  records: MarkAttendanceRequest[]
): Promise<{ data: AttendanceRecord[] }> {
  const response = await axios.post<{ data: AttendanceRecord[] }>(
    `${API_BASE_URL}/attendance/sessions/${sessionId}/records`,
    { records },
    getAxiosConfig()
  )
  return response.data
}