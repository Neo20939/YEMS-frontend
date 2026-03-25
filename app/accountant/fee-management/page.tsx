"use client"

import { useState } from "react"
import { Upload, Plus, Search, FileText, Users, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Invoice, Student } from "@/types/accountant"

// Mock data
const mockInvoices: Invoice[] = [
  { id: "1", invoiceId: "INV-2024-001", studentId: "STU001", studentName: "Chukwuemeka Okafor", class: "SS3", items: [{ id: "1", feeType: "Tuition", description: "Second Term Tuition", amount: 150000 }], totalAmount: 150000, paidAmount: 150000, outstandingAmount: 0, status: "paid", dueDate: "2024-01-15", createdAt: "2024-01-01", createdBy: "admin" },
  { id: "2", invoiceId: "INV-2024-002", studentId: "STU002", studentName: "Fatima Abdullahi", class: "JSS2", items: [{ id: "2", feeType: "Tuition", description: "Second Term Tuition", amount: 120000 }], totalAmount: 120000, paidAmount: 60000, outstandingAmount: 60000, status: "partial", dueDate: "2024-01-15", createdAt: "2024-01-01", createdBy: "admin" },
  { id: "3", invoiceId: "INV-2024-003", studentId: "STU003", studentName: "Ibrahim Musa", class: "SS1", items: [{ id: "3", feeType: "Tuition", description: "Second Term Tuition", amount: 140000 }], totalAmount: 140000, paidAmount: 0, outstandingAmount: 140000, status: "unpaid", dueDate: "2024-01-15", createdAt: "2024-01-01", createdBy: "admin" },
  { id: "4", invoiceId: "INV-2024-004", studentId: "STU004", studentName: "Blessing Okon", class: "JSS1", items: [{ id: "4", feeType: "Tuition", description: "Second Term Tuition", amount: 100000 }], totalAmount: 100000, paidAmount: 0, outstandingAmount: 100000, status: "overdue", dueDate: "2024-01-01", createdAt: "2023-12-15", createdBy: "admin" },
  { id: "5", invoiceId: "INV-2024-005", studentId: "STU005", studentName: "Tobiloba Adeyemi", class: "SS2", items: [{ id: "5", feeType: "Tuition", description: "Second Term Tuition", amount: 145000 }], totalAmount: 145000, paidAmount: 145000, outstandingAmount: 0, status: "paid", dueDate: "2024-01-15", createdAt: "2024-01-01", createdBy: "admin" },
]

export default function FeeManagementPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'batch' | 'ledger'>('invoices')
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
      partial: "bg-blue-50 text-blue-700 border-blue-200",
      unpaid: "bg-gray-50 text-gray-700 border-gray-200",
      overdue: "bg-red-50 text-red-700 border-red-200",
      void: "bg-slate-50 text-slate-700 border-slate-200",
    }
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.unpaid}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-2xl font-bold text-primary">Fee Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage invoices, batch creation, and student ledgers</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="default">
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
              <Button variant="default" size="default">
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'invoices'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'batch'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            Batch Creation
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Student Ledger
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft">
            {/* Filters */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or invoice ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 pl-10 pr-4 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Invoice ID</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Student</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Class</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Amount</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Paid</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Outstanding</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Due Date</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-sm font-mono font-medium text-primary">{invoice.invoiceId}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">{invoice.studentName}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{invoice.class}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-emerald-600">{formatCurrency(invoice.paidAmount)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-amber-600">{formatCurrency(invoice.outstandingAmount)}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm text-gray-600">{new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(invoice.status)}
                      </td>
                      <td className="py-4 px-6">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {filteredInvoices.length} of {mockInvoices.length} invoices
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Batch Invoice Creation</h2>
            <p className="text-gray-600 mb-6">Create invoices for multiple students at once by uploading a CSV file or entering data manually.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drop CSV file here</h3>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <Button variant="outline" size="sm">Select File</Button>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">CSV Format Example:</h3>
              <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm text-gray-600">
                <p>student_id,student_name,class,fee_type,amount,due_date</p>
                <p>STU001,Chukwuemeka Okafor,SS3,Tuition,150000,2024-01-15</p>
                <p>STU002,Fatima Abdullahi,JSS2,Tuition,120000,2024-01-15</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ledger' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Student Ledger</h2>
            <p className="text-gray-600 mb-6">View complete payment history and outstanding balances for individual students.</p>
            
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search student by name or ID..."
                className="h-10 pl-10 pr-4 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a student to view their complete ledger</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
