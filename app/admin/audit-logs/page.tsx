"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { cn } from "@/lib/utils"

interface AuditLog {
  id: string
  action: string
  user: string
  userEmail: string
  role: string
  resource: string
  details: string
  ipAddress: string
  timestamp: string
  status: 'success' | 'failure' | 'warning'
}

// Fetch audit logs from API (returns empty array if backend not available)
const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  try {
    const token = localStorage.getItem('auth_token')
    const response = await fetch('/api/admin/audit-logs', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (response.ok) {
      const data = await response.json()
      return Array.isArray(data) ? data : []
    }
    return []
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    return []
  }
}

const ACTION_ICONS: Record<string, string> = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE_USER: 'person_add',
  UPDATE_USER: 'edit',
  DELETE_USER: 'person_remove',
  CREATE_EXAM: 'add_circle',
  UPDATE_EXAM: 'edit_note',
  DELETE_EXAM: 'delete',
  CREATE_SUBJECT: 'add_circle',
  UPDATE_SUBJECT: 'edit_note',
  DELETE_SUBJECT: 'delete',
  VIEW_REPORT: 'visibility',
  EXPORT_DATA: 'download',
  CHANGE_ROLE: 'admin_panel_settings',
}

const STATUS_COLORS: Record<'success' | 'failure' | 'warning', string> = {
  success: 'bg-emerald-100 text-emerald-700',
  failure: 'bg-rose-100 text-rose-700',
  warning: 'bg-amber-100 text-amber-700',
}

export default function AuditLogsPage() {
  const [logs, setLogs] = React.useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [actionFilter, setActionFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [roleFilter, setRoleFilter] = React.useState<string>('all')
  
  // Date filters
  const [selectedDay, setSelectedDay] = React.useState<string>('all')
  const [selectedMonth, setSelectedMonth] = React.useState<string>('all')
  const [selectedYear, setSelectedYear] = React.useState<string>('all')
  
  // Date options
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))
  const months = [
    { value: '0', label: 'January' },
    { value: '1', label: 'February' },
    { value: '2', label: 'March' },
    { value: '3', label: 'April' },
    { value: '4', label: 'May' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ]
  const years = ['2026', '2025', '2024', '2023']
  
  React.useEffect(() => {
    // Load audit logs from API
    loadLogs()
  }, [])

  async function loadLogs() {
    setIsLoading(true)
    try {
      const data = await fetchAuditLogs()
      setLogs(data)
    } catch (error) {
      console.error('Failed to load audit logs:', error)
      setLogs([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const logDate = new Date(log.timestamp)
    
    // Search filter
    const matchesSearch = 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Action filter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    
    // Role filter
    const matchesRole = roleFilter === 'all' || log.role === roleFilter
    
    // Date filters
    const logDay = String(logDate.getDate()).padStart(2, '0')
    const logMonth = String(logDate.getMonth())
    const logYear = String(logDate.getFullYear())
    
    const matchesDay = selectedDay === 'all' || logDay === selectedDay
    const matchesMonth = selectedMonth === 'all' || logMonth === selectedMonth
    const matchesYear = selectedYear === 'all' || logYear === selectedYear
    
    return matchesSearch && matchesAction && matchesStatus && matchesRole && matchesDay && matchesMonth && matchesYear
  })
  
  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(logs.map(log => log.action))).sort()
  
  // Stats
  const stats = {
    total: filteredLogs.length,
    success: filteredLogs.filter(l => l.status === 'success').length,
    failure: filteredLogs.filter(l => l.status === 'failure').length,
    warning: filteredLogs.filter(l => l.status === 'warning').length,
  }

  const hasApiError = logs.length === 0 && !isLoading
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  
  const clearFilters = () => {
    setSearchQuery('')
    setActionFilter('all')
    setStatusFilter('all')
    setRoleFilter('all')
    setSelectedDay('all')
    setSelectedMonth('all')
    setSelectedYear('all')
  }
  
  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'User', 'Email', 'Role', 'Resource', 'Details', 'IP Address', 'Status'].join(','),
      ...filteredLogs.map(log => 
        [
          log.timestamp,
          log.action,
          log.user,
          log.userEmail,
          log.role,
          log.resource,
          `"${log.details.replace(/"/g, '""')}"`,
          log.ipAddress,
          log.status,
        ].join(',')
      ),
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
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
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                <span className="material-symbols-outlined">list_alt</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Logs</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Success</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.success}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                <span className="material-symbols-outlined">error</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Failures</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.failure}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Warnings</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.warning}</p>
              </div>
            </div>
          </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search logs..."
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
                <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
              ))}
            </select>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failure">Failure</option>
              <option value="warning">Warning</option>
            </select>
            
            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Roles</option>
              <option value="platform_admin">Platform Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="technician">Technician</option>
            </select>
          </div>
          
          {/* Date Filters */}
          <div className="border-t border-stone-200 dark:border-stone-800 pt-4">
            <h4 className="text-xs font-semibold text-slate-500 mb-3">Date Range Filters</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Day Filter */}
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                >
                  <option value="all">All Days</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              {/* Month Filter */}
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Month</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                >
                  <option value="all">All Months</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Year Filter */}
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">Year</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
                >
                  <option value="all">All Years</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
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
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
                {hasApiError ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">cloud_off</span>
                      <p className="text-slate-500 font-medium">Audit logs API not available</p>
                      <p className="text-slate-400 text-sm mt-1">Backend endpoint not implemented yet</p>
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
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
                        <div className="text-sm text-slate-900 dark:text-slate-100">
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            {ACTION_ICONS[log.action] || 'info'}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {log.user}
                          </div>
                          <div className="text-xs text-slate-500">{log.userEmail}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{log.role.replace(/_/g, ' ')}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {log.resource}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                          {log.ipAddress}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
                          STATUS_COLORS[log.status]
                        )}>
                          <span className="material-symbols-outlined text-xs">
                            {log.status === 'success' ? 'check_circle' : log.status === 'failure' ? 'error' : 'warning'}
                          </span>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Info */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            {hasApiError ? 'Backend API not connected' : `Showing ${filteredLogs.length} of ${logs.length} logs`}
          </p>
          {!hasApiError && (
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">info</span>
              <span>Logs are retained for 90 days</span>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
