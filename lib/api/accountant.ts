/**
 * Accountant Portal API Client
 * Handles all API calls for the financial management system
 */

import axios, { AxiosInstance, AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '30000', 10)
const API_RETRIES = parseInt(process.env.API_RETRIES || '3', 10)

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add API key if available
    const apiKey = process.env.NEXT_PUBLIC_API_KEY
    if (apiKey) {
      config.headers['X-API-Key'] = apiKey
    }

    // Add auth token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh token
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        })

        const { accessToken, newRefreshToken } = response.data
        localStorage.setItem('authToken', accessToken)
        localStorage.setItem('refreshToken', newRefreshToken)

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed - redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Retry logic with exponential backoff
async function retryRequest<T>(
  requestFn: () => Promise<T>,
  retries: number = API_RETRIES
): Promise<T> {
  try {
    return await requestFn()
  } catch (error: any) {
    if (retries > 0 && error.response?.status >= 500) {
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, API_RETRIES - retries) * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
      return retryRequest(requestFn, retries - 1)
    }
    throw error
  }
}

// API Service Functions
export const accountantApi = {
  // Dashboard
  dashboard: {
    getKPIs: () => retryRequest(() => apiClient.get('/api/accountant/dashboard/kpis')),
    getClassSummaries: () => retryRequest(() => apiClient.get('/api/accountant/dashboard/classes')),
    getRecentTransactions: (limit = 10) =>
      retryRequest(() => apiClient.get(`/api/accountant/dashboard/transactions?limit=${limit}`)),
    getNextActions: () => retryRequest(() => apiClient.get('/api/accountant/dashboard/actions')),
  },

  // Fee Management
  invoices: {
    list: (params?: any) => retryRequest(() => apiClient.get('/api/accountant/invoices', { params })),
    get: (id: string) => retryRequest(() => apiClient.get(`/api/accountant/invoices/${id}`)),
    create: (data: any) => retryRequest(() => apiClient.post('/api/accountant/invoices', data)),
    update: (id: string, data: any) =>
      retryRequest(() => apiClient.put(`/api/accountant/invoices/${id}`, data)),
    void: (id: string, reason: string) =>
      retryRequest(() => apiClient.post(`/api/accountant/invoices/${id}/void`, { reason })),
    batchCreate: (data: any) => retryRequest(() => apiClient.post('/api/accountant/invoices/batch', data)),
  },

  // Students
  students: {
    list: (params?: any) => retryRequest(() => apiClient.get('/api/accountant/students', { params })),
    get: (id: string) => retryRequest(() => apiClient.get(`/api/accountant/students/${id}`)),
    getLedger: (id: string) => retryRequest(() => apiClient.get(`/api/accountant/students/${id}/ledger`)),
  },

  // Payments
  payments: {
    list: (params?: any) => retryRequest(() => apiClient.get('/api/accountant/payments', { params })),
    get: (id: string) => retryRequest(() => apiClient.get(`/api/accountant/payments/${id}`)),
    create: (data: any) => retryRequest(() => apiClient.post('/api/accountant/payments', data)),
    record: (data: any) => retryRequest(() => apiClient.post('/api/accountant/payments/record', data)),
    match: (paymentId: string, bankTransactionId: string) =>
      retryRequest(() => apiClient.post('/api/accountant/payments/match', { paymentId, bankTransactionId })),
  },

  // Reconciliation
  reconciliation: {
    getBankTransactions: (params?: any) =>
      retryRequest(() => apiClient.get('/api/accountant/reconciliation/bank', { params })),
    getUnmatched: () => retryRequest(() => apiClient.get('/api/accountant/reconciliation/unmatched')),
    match: (data: any) => retryRequest(() => apiClient.post('/api/accountant/reconciliation/match', data)),
    confirm: (id: string) => retryRequest(() => apiClient.post(`/api/accountant/reconciliation/${id}/confirm`)),
    reject: (id: string, reason: string) =>
      retryRequest(() => apiClient.post(`/api/accountant/reconciliation/${id}/reject`, { reason })),
    syncBank: () => retryRequest(() => apiClient.post('/api/accountant/reconciliation/sync')),
  },

  // Outstanding Fees
  outstanding: {
    getAgingReport: () => retryRequest(() => apiClient.get('/api/accountant/outstanding/aging')),
    getByCategory: (category: string) =>
      retryRequest(() => apiClient.get(`/api/accountant/outstanding/${category}`)),
    sendReminder: (studentIds: string[], type: 'sms' | 'email') =>
      retryRequest(() => apiClient.post('/api/accountant/outstanding/remind', { studentIds, type })),
    getPaymentPlans: () => retryRequest(() => apiClient.get('/api/accountant/outstanding/plans')),
    createPaymentPlan: (data: any) =>
      retryRequest(() => apiClient.post('/api/accountant/outstanding/plans', data)),
  },

  // Reports
  reports: {
    generate: (type: string, period: string) =>
      retryRequest(() => apiClient.post('/api/accountant/reports/generate', { type, period })),
    list: (params?: any) => retryRequest(() => apiClient.get('/api/accountant/reports', { params })),
    get: (id: string) => retryRequest(() => apiClient.get(`/api/accountant/reports/${id}`)),
    download: (id: string, format: 'pdf' | 'csv' | 'xlsx') =>
      retryRequest(() => apiClient.get(`/api/accountant/reports/${id}/download?format=${format}`, {
        responseType: 'blob',
      })),
    export: (type: string, format: string) =>
      retryRequest(() => apiClient.get(`/api/accountant/reports/export?type=${type}&format=${format}`, {
        responseType: 'blob',
      })),
  },

  // Settings
  settings: {
    get: () => retryRequest(() => apiClient.get('/api/accountant/settings')),
    update: (data: any) => retryRequest(() => apiClient.put('/api/accountant/settings', data)),
    getFeeStructure: () => retryRequest(() => apiClient.get('/api/accountant/settings/fees')),
    updateFeeStructure: (data: any) =>
      retryRequest(() => apiClient.put('/api/accountant/settings/fees', data)),
    getPaymentMethods: () => retryRequest(() => apiClient.get('/api/accountant/settings/payment-methods')),
    updatePaymentMethods: (data: any) =>
      retryRequest(() => apiClient.put('/api/accountant/settings/payment-methods', data)),
  },

  // Users & Permissions
  users: {
    list: () => retryRequest(() => apiClient.get('/api/accountant/users')),
    get: (id: string) => retryRequest(() => apiClient.get(`/api/accountant/users/${id}`)),
    create: (data: any) => retryRequest(() => apiClient.post('/api/accountant/users', data)),
    update: (id: string, data: any) =>
      retryRequest(() => apiClient.put(`/api/accountant/users/${id}`, data)),
    delete: (id: string) => retryRequest(() => apiClient.delete(`/api/accountant/users/${id}`)),
    getRoles: () => retryRequest(() => apiClient.get('/api/accountant/users/roles')),
  },

  // Audit Logs
  audit: {
    list: (params?: any) => retryRequest(() => apiClient.get('/api/accountant/audit', { params })),
    get: (id: string) => retryRequest(() => apiClient.get(`/api/accountant/audit/${id}`)),
    export: (params?: any) =>
      retryRequest(() => apiClient.get('/api/accountant/audit/export', { params, responseType: 'blob' })),
  },

  // Notifications
  notifications: {
    list: () => retryRequest(() => apiClient.get('/api/accountant/notifications')),
    markAsRead: (id: string) =>
      retryRequest(() => apiClient.post(`/api/accountant/notifications/${id}/read`)),
    markAllAsRead: () => retryRequest(() => apiClient.post('/api/accountant/notifications/read-all')),
    getSettings: () => retryRequest(() => apiClient.get('/api/accountant/notifications/settings')),
    updateSettings: (data: any) =>
      retryRequest(() => apiClient.put('/api/accountant/notifications/settings', data)),
  },

  // Backup
  backup: {
    create: () => retryRequest(() => apiClient.post('/api/accountant/backup')),
    list: () => retryRequest(() => apiClient.get('/api/accountant/backup')),
    restore: (id: string) => retryRequest(() => apiClient.post(`/api/accountant/backup/${id}/restore`)),
    download: (id: string) =>
      retryRequest(() => apiClient.get(`/api/accountant/backup/${id}/download`, { responseType: 'blob' })),
  },
}

// Export types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export default apiClient
