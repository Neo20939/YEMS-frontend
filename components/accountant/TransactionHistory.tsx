"use client"

import { ArrowUpRight, Clock, CheckCircle, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Transaction } from "@/types/accountant/dashboard"

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reconciled':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
      case 'matched':
        return <ArrowUpRight className="w-4 h-4 text-blue-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />
      case 'disputed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      reconciled: "bg-emerald-50 text-emerald-700 border-emerald-200",
      matched: "bg-blue-50 text-blue-700 border-blue-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      disputed: "bg-red-50 text-red-700 border-red-200",
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getPaymentMethodIcon = (method: string) => {
    const icons: Record<string, string> = {
      bank_transfer: "🏦",
      card: "💳",
      mobile_money: "📱",
      cash: "💵",
      cheque: "📝",
    }
    return icons[method] || "💰"
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          <p className="text-sm text-gray-500 mt-1">Latest payment activities</p>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Payment ID</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Student</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Class</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Method</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Amount</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Time</th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <span className="text-sm font-mono font-medium text-primary">{transaction.paymentId}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-medium text-gray-900">{transaction.studentName}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-600">{transaction.class}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getPaymentMethodIcon(transaction.paymentMethod)}</span>
                    <span className="text-sm text-gray-600 capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(transaction.amount)}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-500">{formatTime(transaction.transactionDate)}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(transaction.status)}
                    {getStatusBadge(transaction.status)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
