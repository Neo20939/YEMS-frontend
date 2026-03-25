"use client"

import { useState } from "react"
import { Search, Bell, Download, Filter, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AgingEntry } from "@/types/accountant"

// Mock aging data
const mockAgingData = {
  current: [
    { studentId: "STU010", studentName: "Amina Yusuf", class: "JSS1", amount: 50000, dueDate: "2024-03-25", daysOverdue: 0 },
    { studentId: "STU011", studentName: "Kelvin Obi", class: "SS2", amount: 75000, dueDate: "2024-03-28", daysOverdue: 0 },
  ],
  days30: [
    { studentId: "STU002", studentName: "Fatima Abdullahi", class: "JSS2", amount: 60000, dueDate: "2024-02-15", daysOverdue: 15 },
    { studentId: "STU003", studentName: "Ibrahim Musa", class: "SS1", amount: 140000, dueDate: "2024-02-10", daysOverdue: 20 },
    { studentId: "STU012", studentName: "Grace Eze", class: "JSS3", amount: 95000, dueDate: "2024-02-20", daysOverdue: 10 },
  ],
  days60: [
    { studentId: "STU004", studentName: "Blessing Okon", class: "JSS1", amount: 100000, dueDate: "2024-01-15", daysOverdue: 45 },
    { studentId: "STU013", studentName: "Ahmed Bello", class: "SS3", amount: 160000, dueDate: "2024-01-10", daysOverdue: 50 },
  ],
  days90: [
    { studentId: "STU014", studentName: "Chidinma Nnamdi", class: "JSS2", amount: 110000, dueDate: "2023-12-15", daysOverdue: 75 },
  ],
  days90Plus: [
    { studentId: "STU015", studentName: "Emmanuel Okoro", class: "SS1", amount: 140000, dueDate: "2023-11-20", daysOverdue: 95 },
    { studentId: "STU016", studentName: "Zainab Ibrahim", class: "JSS3", amount: 95000, dueDate: "2023-11-15", daysOverdue: 100 },
  ],
}

export default function OutstandingFeesPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'days30' | 'days60' | 'days90' | 'days90Plus'>('current')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const getData = () => {
    return mockAgingData[activeTab] || []
  }

  const filteredData = getData().filter(entry =>
    entry.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`
  }

  const getTotal = () => {
    return getData().reduce((sum, entry) => sum + entry.amount, 0)
  }

  const getTabStats = (key: string, data: AgingEntry[]) => {
    const counts: Record<string, number> = {
      current: mockAgingData.current.length,
      days30: mockAgingData.days30.length,
      days60: mockAgingData.days60.length,
      days90: mockAgingData.days90.length,
      days90Plus: mockAgingData.days90Plus.length,
    }
    return counts[key]
  }

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    )
  }

  const tabs = [
    { key: 'current', label: 'Current', color: 'bg-emerald-500' },
    { key: 'days30', label: '0-30 Days', color: 'bg-blue-500' },
    { key: 'days60', label: '30-60 Days', color: 'bg-amber-500' },
    { key: 'days90', label: '60-90 Days', color: 'bg-orange-500' },
    { key: 'days90Plus', label: '90+ Days', color: 'bg-red-500' },
  ]

  return (
    <div className="pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-2xl font-bold text-primary">Outstanding Fees</h1>
              <p className="text-sm text-gray-500 mt-1">Track overdue payments and send reminders</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedStudents.length > 0 && (
                <Button variant="default" size="default">
                  <Send className="w-4 h-4 mr-2" />
                  Send Reminders ({selectedStudents.length})
                </Button>
              )}
              <Button variant="outline" size="default">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        <div className="grid grid-cols-5 gap-4">
          {tabs.map((tab) => {
            const count = getTabStats(tab.key, getData())
            const data = mockAgingData[tab.key as keyof typeof mockAgingData]
            const total = data?.reduce((sum, entry) => sum + entry.amount, 0) || 0
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`rounded-xl p-4 border transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary text-white border-primary shadow-lg'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${tab.color} mb-2`} />
                <p className={`text-xs font-medium ${activeTab === tab.key ? 'text-white/80' : 'text-gray-500'}`}>
                  {tab.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${activeTab === tab.key ? 'text-white' : 'text-gray-900'}`}>
                  {count}
                </p>
                <p className={`text-xs mt-1 ${activeTab === tab.key ? 'text-white/70' : 'text-gray-500'}`}>
                  ₦{(total / 1000).toFixed(0)}K
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-soft">
          {/* Filters */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-gray-900">
                  {tabs.find(t => t.key === activeTab)?.label} Overdue
                </h2>
                <span className="text-sm text-gray-500">
                  {filteredData.length} students · {formatCurrency(getTotal())} total
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-10 pl-10 pr-4 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents(filteredData.map(s => s.studentId))
                        } else {
                          setSelectedStudents([])
                        }
                      }}
                      checked={selectedStudents.length === filteredData.length && filteredData.length > 0}
                    />
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Student ID</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Student Name</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Class</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Amount Due</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Due Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Days Overdue</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredData.map((entry) => (
                  <tr key={entry.studentId} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        checked={selectedStudents.includes(entry.studentId)}
                        onChange={() => toggleStudent(entry.studentId)}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono font-medium text-gray-600">{entry.studentId}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-900">{entry.studentName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">{entry.class}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-red-600">{formatCurrency(entry.amount)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(entry.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        entry.daysOverdue <= 30 ? 'bg-blue-100 text-blue-700' :
                        entry.daysOverdue <= 60 ? 'bg-amber-100 text-amber-700' :
                        entry.daysOverdue <= 90 ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {entry.daysOverdue} days
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Bell className="w-3 h-3 mr-1" />
                          Reminder
                        </Button>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No students in this category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
