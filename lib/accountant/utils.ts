/**
 * Utility functions for the Accountant Portal
 */

/**
 * Format currency in Nigerian Naira
 */
export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`
}

/**
 * Format currency with millions abbreviation
 */
export function formatCurrencyMillions(amount: number): string {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(2)}M`
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}K`
  }
  return `₦${amount}`
}

/**
 * Format date to readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format date with time
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format relative time (e.g., "2h ago", "3d ago")
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(dateString)
}

/**
 * Calculate collection percentage
 */
export function calculateCollectionPercentage(collected: number, billed: number): number {
  if (billed === 0) return 0
  return Math.round((collected / billed) * 100)
}

/**
 * Get invoice status color
 */
export function getInvoiceStatusColor(status: string): string {
  const colors: Record<string, string> = {
    paid: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    partial: 'text-blue-600 bg-blue-50 border-blue-200',
    unpaid: 'text-gray-600 bg-gray-50 border-gray-200',
    overdue: 'text-red-600 bg-red-50 border-red-200',
    void: 'text-slate-600 bg-slate-50 border-slate-200',
  }
  return colors[status] || colors.unpaid
}

/**
 * Get payment status color
 */
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    reconciled: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    matched: 'text-blue-600 bg-blue-50 border-blue-200',
    pending: 'text-amber-600 bg-amber-50 border-amber-200',
    disputed: 'text-red-600 bg-red-50 border-red-200',
  }
  return colors[status] || colors.pending
}

/**
 * Get aging category color
 */
export function getAgingCategoryColor(days: number): string {
  if (days <= 0) return 'text-emerald-600 bg-emerald-50'
  if (days <= 30) return 'text-blue-600 bg-blue-50'
  if (days <= 60) return 'text-amber-600 bg-amber-50'
  if (days <= 90) return 'text-orange-600 bg-orange-50'
  return 'text-red-600 bg-red-50'
}

/**
 * Validate Nigerian phone number
 */
export function validateNigerianPhone(phone: string): boolean {
  const regex = /^(\+234|0)?[789][01][0-9]{8}$/
  return regex.test(phone.replace(/\s/g, ''))
}

/**
 * Generate unique invoice ID
 */
export function generateInvoiceId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${year}-${random}`
}

/**
 * Generate unique payment ID
 */
export function generatePaymentId(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `PAY-${year}-${random}`
}

/**
 * Calculate days overdue
 */
export function calculateDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  const diffMs = today.getTime() - due.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  return Math.max(0, diffDays)
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Download file from blob
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

/**
 * Export table to CSV
 */
export function exportTableToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string
): void {
  if (data.length === 0) return

  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value).replace(/"/g, '""')
        return escaped.includes(',') ? `"${escaped}"` : escaped
      }).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  downloadFile(blob, filename)
}
