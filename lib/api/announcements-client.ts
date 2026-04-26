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

export interface Announcement {
  id: string
  title: string
  content: string
  targetRoles: string[]
  targetClasses?: string[]
  priority: 'low' | 'normal' | 'high' | 'urgent'
  publishAt: string
  expiresAt?: string
  isActive: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateAnnouncementRequest {
  title: string
  content: string
  targetRoles: string[]
  targetClasses?: string[]
  priority?: 'low' | 'normal' | 'high' | 'urgent'
  publishAt: string
  expiresAt?: string
}

export async function getAnnouncements(): Promise<{ data: Announcement[] }> {
  const response = await axios.get<{ data: Announcement[] }>(
    `${API_BASE_URL}/announcements`,
    getAxiosConfig()
  )
  return response.data
}

export async function getTargetedAnnouncements(): Promise<{ data: Announcement[] }> {
  const response = await axios.get<{ data: Announcement[] }>(
    `${API_BASE_URL}/announcements/targeted`,
    getAxiosConfig()
  )
  return response.data
}

export async function getAnnouncementById(id: string): Promise<Announcement> {
  const response = await axios.get<{ data: Announcement }>(
    `${API_BASE_URL}/announcements/${id}`,
    getAxiosConfig()
  )
  return response.data.data
}

export async function createAnnouncement(data: CreateAnnouncementRequest): Promise<Announcement> {
  const response = await axios.post<{ data: Announcement }>(
    `${API_BASE_URL}/announcements`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function updateAnnouncement(id: string, data: Partial<CreateAnnouncementRequest>): Promise<Announcement> {
  const response = await axios.patch<{ data: Announcement }>(
    `${API_BASE_URL}/announcements/${id}`,
    data,
    getAxiosConfig()
  )
  return response.data.data
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await axios.delete(
    `${API_BASE_URL}/announcements/${id}`,
    getAxiosConfig()
  )
}