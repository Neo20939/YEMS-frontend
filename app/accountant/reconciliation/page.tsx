"use client"

import { useState } from "react"
import { Search, CheckCircle, XCircle, AlertCircle, RefreshCcw, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BankTransaction, ReconciliationWorkflow } from "@/types/accountant"

// Mock data
const mockBankTransactions: BankTransaction[] = [
  { id: "1", transactionId: "BNK-2024-001", date: "2024-03-22T10:30:00", description: "Transfer from Chukwuemeka Okafor", amount: 150000, type: "credit", balance: 12350000, status: "matched" },
  { id: "2", transactionId: "BNK-2024-002", date: "2024-03-22T09:15:00", description: "Card payment - Fatima A.", amount: 120000, type: "credit", balance: 12200000, status: "unmatched" },
  { id: "3", transactionId: "BNK-2024-003", date: "2024-03-21T16:45:00", description: "Mobile transfer", amount: 180000, type: "credit", balance: 12080000, status: "reconciled" },
  { id: "4", transactionId: "BNK-2024-004", date: "2024-03-21T14:20:00", description: "Cash deposit - Blessing O.", amount: 100000, type: "credit", balance: 11900000, status: "pending" },
  { id: "5", transactionId: "BNK-2024-005", date: "2024-03-21T11:00:00", description: "Transfer - Tobiloba Adeyemi", amount: 200000, type: "credit", balance: 11800000, status: "matched" },
  { id: "6", transactionId: "BNK-2024-006", date: "2024-03-20T15:30:00", description: "POS payment", amount: 95000, type: "credit", balance: 11600000, status: "unmatched" },
  { id: "7", transactionId: "BNK-2024-007", date: "2024-03-20T13:10:00", description: "Transfer from Yusuf Bello", amount: 175000, type: "credit", balance: 11505000, status: "reconciled" },
  { id: "8", transactionId: "BNK-2024-008", date: "2024-03-20T10:45:00", description: "Mobile money - Chidinma N.", amount: 110000, type: "credit", balance: 11330000, status: "pending" },
  { id: "9", transactionId: "BNK-2024-009", date: "2024-03-19T16:00:00", description: "Cheque deposit", amount: 160000, type: "credit", balance: 11220000, status: "unmatched" },
  { id: "10", transactionId: "BNK-2024-010", date: "2024-03-19T14:30:00", description: "Transfer - Precious Okoro", amount: 105000, type: "credit", balance: 11060000, status: "reconciled" },
  { id: "11", transactionId: "WDL-2024-001", date: "2024-03-19T10:00:00", description: "Salary payment - Staff", amount: -450000, type: "debit", balance: 10955000, status: "reconciled" },
  { id: "12", transactionId: "WDL-2024-002", date: "2024-03-18T15:00:00", description: "Utility payment", amount: -85000, type: "debit", balance: 11405000, status: "reconciled" },
]

export default function ReconciliationPage() {
  const [filter, setFilter] = useState<'all' | 'unmatched' | 'pending' | 'matched' | 'reconciled'>('all')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null)

  const filteredTransactions = mockBankTransactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.status === filter
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const formatCurrency = (amount: number) => {
    return `₦${Math.abs(amount).toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      reconciled: "bg-emerald-50 text-emerald-700 border-emerald-200",
      matched: "bg-blue-50 text-blue-700 border-blue-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      unmatched: "bg-red-50 text-red-700 border-red-200",
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const stats = {
    unmatched: mockBankTransactions.filter(tx => tx.status === 'unmatched').length,
    pending: mockBankTransactions.filter(tx => tx.status === 'pending').length,
    matched: mockBankTransactions.filter(tx => tx.status === 'matched').length,
    reconciled: mockBankTransactions.filter(tx => tx.status === 'reconciled').length,
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-2xl font-bold text-primary">Payment Reconciliation</h1>
              <p className="text-sm text-gray-500 mt-1">Match bank transactions with student payments</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="default">
                <FileText className="w-4 h-4 mr-2" />
                Import Bank Statement
              </Button>
              <Button variant="default" size="default">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Sync Bank
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-xl p-4 border border-red-200">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-700">Unmatched</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-2">{stats.unmatched}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-medium text-amber-700">Pending</span>
            </div>
            <p className="text-2xl font-bold text-amber-900 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Matched</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-2">{stats.matched}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Reconciled</span>
            </div>
            <p className="text-2xl font-bold text-emerald-900 mt-2">{stats.reconciled}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft">
          {/* Filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unmatched')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unmatched' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Unmatched
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'pending' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter('matched')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'matched' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Matched
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 pl-10 pr-4 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Transaction ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Description</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Amount</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono font-medium text-primary">{tx.transactionId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">{tx.description}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        tx.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.type === 'credit' ? 'Deposit' : 'Withdrawal'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(tx.status)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {tx.status === 'unmatched' && (
                          <>
                            <Button variant="default" size="sm">Match</Button>
                            <Button variant="outline" size="sm">Flag</Button>
                          </>
                        )}
                        {tx.status === 'matched' && (
                          <>
                            <Button variant="default" size="sm">Confirm</Button>
                            <Button variant="outline" size="sm">Reject</Button>
                          </>
                        )}
                        {tx.status === 'pending' && (
                          <Button variant="outline" size="sm">Review</Button>
                        )}
                        {tx.status === 'reconciled' && (
                          <span className="text-xs text-gray-400">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
