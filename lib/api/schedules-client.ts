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

export interface ScheduleEntry {
  id: string
  classId: string
  className?: string
  subjectId: string
  subjectName?: string
  teacherId: string
  teacherName?: string
  dayOfWeek: number
  dayName: string
  startTime: string
  endTime: string
  room?: string
  academicYearId: string
  termId: string
}

export interface TimetableDay {
  day: number
  dayName: string
  entries: ScheduleEntry[]
}

export async function getStudentTimetable(filters?: {
  classId?: string
  academicYearId?: string
  termId?: string
}): Promise<{ data: TimetableDay[] }> {
  const params = new URLSearchParams()
  if (filters?.classId) params.append('classId', filters.classId)
  if (filters?.academicYearId) params.append('academicYearId', filters.academicYearId)
  if (filters?.termId) params.append('termId', filters.termId)

  const response = await axios.get<{ data: TimetableDay[] }>(
    `${API_BASE_URL}/schedules/student?${params}`,
    getAxiosConfig()
  )
  return response.data
}

export async function getTeacherTimetable(filters?: {
  teacherId?: string
  academicYearId?: string
  termId?: string
}): Promise<{ data: TimetableDay[] }> {
  const params = new URLSearchParams()
  if (filters?.teacherId) params.append('teacherId', filters.teacherId)
  if (filters?.academicYearId) params.append('academicYearId', filters.academicYearId)
  if (filters?.termId) params.append('termId', filters.termId)

  const response = await axios.get<{ data: TimetableDay[] }>(
    `${API_BASE_URL}/schedules/teacher?${params}`,
    getAxiosConfig()
  )
  return response.data
}

export async function getAdminTimetable(filters?: {
  classId?: string
  teacherId?: string
  academicYearId?: string
  termId?: string
}): Promise<{ data: ScheduleEntry[] }> {
  const params = new URLSearchParams()
  if (filters?.classId) params.append('classId', filters.classId)
  if (filters?.teacherId) params.append('teacherId', filters.teacherId)
  if (filters?.academicYearId) params.append('academicYearId', filters.academicYearId)
  if (filters?.termId) params.append('termId', filters.termId)

  const response = await axios.get<{ data: ScheduleEntry[] }>(
    `${API_BASE_URL}/schedules/admin?${params}`,
    getAxiosConfig()
  )
  return response.data
}

export async function createScheduleEntry(data: {
  classId: string
  subjectId: string
  teacherId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room?: string
  academicYearId: string
  termId: string
}): Promise<ScheduleEntry> {
  const response = await axios.post<{ data: ScheduleEntry }>(
    `${API_BASE_URL}/schedules`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function updateScheduleEntry(
  id: string,
  data: Partial<{
    subjectId: string
    teacherId: string
    dayOfWeek: number
    startTime: string
    endTime: string
    room: string
  }>
): Promise<ScheduleEntry> {
  const response = await axios.patch<{ data: ScheduleEntry }>(
    `${API_BASE_URL}/schedules/${id}`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function deleteScheduleEntry(id: string): Promise<void> {
  await axios.delete(
    `${API_BASE_URL}/schedules/${id}`,
    getAxiosConfig()
  )
}