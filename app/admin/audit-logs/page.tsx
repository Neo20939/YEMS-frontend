"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { cn } from "@/lib/utils"
import type { AuditLog, AuditAction } from "@/types/audit"

// Fetch audit logs from API proxy
const fetchAuditLogs = async (filters: Record<string, string> = {}): Promise<{
  data: AuditLog[]
  pagination?: { total: number; page: number; limit: number; totalPages: number }
}> => {
  try {
    const token = localStorage.getItem('auth_token')
    const queryParams = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value)
    })

    const response = await fetch(`/api/admin/audit-logs?${queryParams.toString()}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    if (response.ok) {
      const data = await response.json()
      // Backend returns either { success: true, data: [...], pagination: {...} }
      // or just the array directly
      if (data.success) {
        return data
      }
      return { data: Array.isArray(data) ? data : [] }
    }

    console.error('Audit logs fetch failed:', response.status)
    return { data: [] }
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    return { data: [] }
  }
}

// Action icon mapping
const ACTION_ICONS: Record<AuditAction | string, string> = {
  USER_CREATE: 'person_add',
  USER_UPDATE: 'edit',
  USER_DELETE: 'person_remove',
  USER_LOGIN: 'login',
  USER_LOGOUT: 'logout',
  PASSWORD_RESET: 'key',
  CLASS_CREATE: 'add_circle',
  CLASS_UPDATE: 'edit_note',
  CLASS_DELETE: 'delete',
  STUDENT_ENROLL: 'school',
  STUDENT_TRANSFER: 'swap_horiz',
  STUDENT_PROMOTE: 'arrow_upward',
  STUDENT_CREATE: 'person_add',
  EXAM_CREATE: 'add_circle',
  EXAM_UPDATE: 'edit_note',
  EXAM_DELETE: 'delete',
  EXAM_PUBLISH: 'publish',
  EXAM_UNPUBLISH: 'unpublished',
  NOTE_CREATE: 'note_add',
  NOTE_UPDATE: 'edit_note',
  NOTE_DELETE: 'delete',
  NOTE_PUBLISH: 'publish',
  NOTE_UNPUBLISH: 'unpublished',
  FEE_CREATE: 'receipt',
  FEE_UPDATE: 'edit',
  PAYMENT_RECORD: 'payments',
  PAYMENT_REVERSE: 'undo',
  ANNOUNCEMENT_CREATE: 'campaign',
  ANNOUNCEMENT_UPDATE: 'edit',
  ANNOUNCEMENT_DELETE: 'delete',
  ATTENDANCE_SESSION_CREATE: 'calendar_month',
  ATTENDANCE_RECORD: 'check_circle',
  INCIDENT_CREATE: 'report',
  INCIDENT_UPDATE: 'edit',
  INCIDENT_RESOLVE: 'check_circle',
  SYSTEM_RESTART: 'restart_alt',
  HEALTH_CHECK: 'healing',
}

// Clean status field from backend response
function inferStatus(action: string): 'success' | 'warning' | 'failure' {
  const failActions = ['USER_DELETE', 'CLASS_DELETE', 'EXAM_DELETE', 'NOTE_DELETE', 'SYSTEM_RESTART']
  const warningActions = ['EXAM_PUBLISH', 'NOTE_PUBLISH', 'ANNOUNCEMENT_CREATE']
  if (failActions.some(a => action.includes(a))) return 'failure'
  if (warningActions.some(a => action.includes(a))) return 'warning'
  return 'success'
}

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [pagination, setPagination] = React.useState<{ total: number; page: number; totalPages: number } | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')

  // Filters
  const [actionFilter, setActionFilter] = React.useState<string>('all')
  const [entityTypeFilter, setEntityTypeFilter] = React.useState<string>('all')
  const [actorIdFilter, setActorIdFilter] = React.useState<string>('')
  const [dateFrom, setDateFrom] = React.useState<string>('')
  const [dateTo, setDateTo] = React.useState<string>('')

  const page = 1
  const limit = 50

  React.useEffect(() => {
    loadLogs()
  }, [actionFilter, entityTypeFilter, actorIdFilter, dateFrom, dateTo])

  async function loadLogs() {
    setIsLoading(true)
    try {
      const filters: Record<string, string> = { page: String(page), limit: String(limit) }
      if (actionFilter !== 'all') filters.action = actionFilter
      if (entityTypeFilter !== 'all') filters.entityType = entityTypeFilter
      if (actorIdFilter) filters.actorId = actorIdFilter
      if (dateFrom) filters.from = dateFrom
      if (dateTo) filters.to = dateTo

      const result = await fetchAuditLogs(filters)
      setLogs(result.data)
      setPagination(result.pagination ?? null)
    } catch (error) {
      console.error('Failed to load audit logs:', error)
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }

  // Extract unique actions from logs
  const uniqueActions = Array.from(new Set(logs.map(log => log.action)))

  // Format timestamp for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // Export to CSV using backend endpoint
  const exportLogs = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const queryParams = new URLSearchParams()
      if (actionFilter !== 'all') queryParams.append('action', actionFilter)
      if (entityTypeFilter !== 'all') queryParams.append('entityType', entityTypeFilter)
      if (actorIdFilter) queryParams.append('actorId', actorIdFilter)
      if (dateFrom) queryParams.append('from', dateFrom)
      if (dateTo) queryParams.append('to', dateTo)

      const response = await fetch(`/api/admin/audit-logs/export?${queryParams.toString()}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        alert(`Export failed: ${error.message || 'Unknown error'}`)
        return
      }

      const csvText = await response.text()
      const blob = new Blob([csvText], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
      alert('Failed to export audit logs')
    }
  }

  const clearFilters = () => {
    setActionFilter('all')
    setEntityTypeFilter('all')
    setActorIdFilter('')
    setDateFrom('')
    setDateTo('')
    setSearchQuery('')
  }

  // Filter logs client-side for search
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchQuery === '' ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.entity_type && log.entity_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (log.actor_id && log.actor_id.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  // Stats
  const stats = {
    total: filteredLogs.length,
    // Could break down by action type if needed
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading audit logs...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Audit Logs
            </h2>
            <p className="text-slate-500 mt-1">
              Track and monitor all system activities and user actions
            </p>
          </div>
          <button
            onClick={exportLogs}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-primary font-semibold hover:text-primary-dark"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search actions, entities, or details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            {/* Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map((action) => (
                <option key={action} value={action}>
                  {action.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            {/* Entity Type Filter */}
            <select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Entity Types</option>
              <option value="USER">User</option>
              <option value="CLASS">Class</option>
              <option value="STUDENT">Student</option>
              <option value="ENROLLMENT">Enrollment</option>
              <option value="EXAM">Exam</option>
              <option value="QUESTION">Question</option>
              <option value="NOTE">Note</option>
              <option value="FEE_RECORD">Fee Record</option>
              <option value="PAYMENT">Payment</option>
              <option value="ANNOUNCEMENT">Announcement</option>
              <option value="ATTENDANCE_SESSION">Attendance Session</option>
            </select>

            {/* Actor Filter */}
            <input
              type="text"
              placeholder="Filter by actor ID (user UUID)"
              value={actorIdFilter}
              onChange={(e) => setActorIdFilter(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Date Range */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-4 mt-4">
            <h4 className="text-xs font-semibold text-slate-500 mb-3">Date Range</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Entity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actor ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-4 text-slate-500">Loading...</p>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">search_off</span>
                      <p className="text-slate-500 font-medium">No logs found</p>
                      <p className="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 dark:text-slate-100 font-mono">
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            {ACTION_ICONS[log.action as AuditAction] || 'info'}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                          {log.entity_type?.replace(/_/g, ' ') || 'Unknown'}
                        </span>
                        {log.entity_id && (
                          <div className="text-xs text-slate-400 mt-1 font-mono">
                            ID: {log.entity_id.substring(0, 8)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 dark:text-slate-300 max-w-md truncate">
                          {log.details || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400 font-mono">
                          {log.actor_id?.substring(0, 8) || '-'}...
                        </code>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Info */}
        {pagination && (
          <div className="flex items-center justify-between text-sm text-slate-500">
            <p>
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total logs)
            </p>
          </div>
        )}

        {/* Help text */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 mt-0.5">
            info
          </span>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold mb-1">Audit Trail</p>
            <p className="text-blue-700 dark:text-blue-300">
              Audit logs capture all system activities including user management, class operations, enrollments, exams, notes, and financial transactions.
              Logs are retained for 90 days and can be exported as CSV for compliance reporting.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
