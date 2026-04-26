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

export interface AuditLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

export interface AuditFilters {
  userId?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export async function getAuditLogs(filters?: AuditFilters): Promise<{ data: AuditLog[]; pagination?: any }> {
  const params = new URLSearchParams()
  if (filters?.userId) params.append('userId', filters.userId)
  if (filters?.action) params.append('action', filters.action)
  if (filters?.resource) params.append('resource', filters.resource)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await axios.get<{ data: AuditLog[]; pagination?: any }>(
    `${API_BASE_URL}/audit/logs?${params}`,
    getAxiosConfig()
  )
  return response.data
}

export async function exportAuditLogs(filters?: AuditFilters): Promise<Blob> {
  const params = new URLSearchParams()
  if (filters?.userId) params.append('userId', filters.userId)
  if (filters?.action) params.append('action', filters.action)
  if (filters?.resource) params.append('resource', filters.resource)
  if (filters?.startDate) params.append('startDate', filters.startDate)
  if (filters?.endDate) params.append('endDate', filters.endDate)

  const response = await fetch(
    `${API_BASE_URL}/audit/logs/export?${params}`,
    {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      credentials: 'include',
    }
  )

  if (!response.ok) {
    throw new Error('Failed to export audit logs')
  }

  return response.blob()
}

export async function downloadAuditLogsCsv(filters?: AuditFilters): Promise<void> {
  const blob = await exportAuditLogs(filters)
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `audit-logs-${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}