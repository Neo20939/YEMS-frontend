"use client"

import { useState } from "react"
import { FileText, Download, Calendar, TrendingUp, PieChart, FileCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FinancialReport } from "@/types/accountant"

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'monthly' | 'termly' | 'compliance' | 'variance'>('monthly')
  const [selectedPeriod, setSelectedPeriod] = useState("2024-03")

  const reportCategories = [
    {
      id: 'monthly' as const,
      title: 'Monthly Reports',
      icon: FileText,
      description: 'Revenue, collection analysis, and cash flow',
      reports: [
        { name: 'Revenue Report', description: 'Total billed vs. collected by class', action: 'Generate' },
        { name: 'Collection Analysis', description: 'Percentage collected and outstanding', action: 'Generate' },
        { name: 'Cash Flow Statement', description: 'Money in, money out, net position', action: 'Generate' },
        { name: 'Account Reconciliation', description: 'Bank balance vs. system records', action: 'Generate' },
      ],
    },
    {
      id: 'termly' as const,
      title: 'Term Reports',
      icon: Calendar,
      description: 'Termly summaries and comparisons',
      reports: [
        { name: 'Term Collection Summary', description: 'Overall collection performance', action: 'Generate' },
        { name: 'Class Performance', description: 'Collection by class comparison', action: 'Generate' },
        { name: 'Fee Type Analysis', description: 'Breakdown by fee categories', action: 'Generate' },
      ],
    },
    {
      id: 'compliance' as const,
      title: 'Compliance Reports',
      icon: FileCheck,
      description: 'Audit trails and exception reports',
      reports: [
        { name: 'Audit Trail', description: 'All transactions with timestamps', action: 'Export' },
        { name: 'Voided Invoices', description: 'Cancelled invoices with reasons', action: 'Export' },
        { name: 'Exception Report', description: 'Unusual transactions flagged', action: 'Export' },
        { name: 'User Activity Log', description: 'Login and action history', action: 'Export' },
      ],
    },
    {
      id: 'variance' as const,
      title: 'Variance Analysis',
      icon: TrendingUp,
      description: 'Budget vs. actual comparisons',
      reports: [
        { name: 'Budget Variance', description: 'Budgeted vs. actual collected', action: 'Analyze' },
        { name: 'Trend Analysis', description: 'Term-over-term comparison', action: 'Analyze' },
        { name: 'Target Achievement', description: 'Target vs. actual performance', action: 'Analyze' },
      ],
    },
  ]

  const mockReportData = {
    totalBilled: 63800000,
    totalCollected: 41630000,
    totalOutstanding: 22170000,
    collectionRate: 65.2,
    byClass: [
      { class: 'JSS1', collected: 8400000, billed: 12000000, percentage: 70 },
      { class: 'JSS2', collected: 7350000, billed: 10500000, percentage: 70 },
      { class: 'JSS3', collected: 6370000, billed: 9800000, percentage: 65 },
      { class: 'SS1', collected: 7280000, billed: 11200000, percentage: 65 },
      { class: 'SS2', collected: 6480000, billed: 10800000, percentage: 60 },
      { class: 'SS3', collected: 5700000, billed: 9500000, percentage: 60 },
    ],
  }

  const formatCurrency = (amount: number) => {
    return `₦${(amount / 1000000).toFixed(2)}M`
  }

  return (
    <div className="pb-12">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex items-center justify-between h-20">
            <div>
              <h1 className="text-2xl font-bold text-primary">Financial Reports</h1>
              <p className="text-sm text-gray-500 mt-1">Generate and export financial reports</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none"
                >
                  <option value="2024-03">March 2024</option>
                  <option value="2024-02">February 2024</option>
                  <option value="2024-01">January 2024</option>
                  <option value="2023-12">December 2023</option>
                </select>
              </div>
              <Button variant="default" size="default">
                <Download className="w-4 h-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-soft">
            <p className="text-sm text-gray-500">Total Billed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(mockReportData.totalBilled)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-soft">
            <p className="text-sm text-gray-500">Total Collected</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(mockReportData.totalCollected)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-soft">
            <p className="text-sm text-gray-500">Outstanding</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{formatCurrency(mockReportData.totalOutstanding)}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-soft">
            <p className="text-sm text-gray-500">Collection Rate</p>
            <p className="text-2xl font-bold text-primary mt-1">{mockReportData.collectionRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6">
        {/* Category Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex mb-6">
          {reportCategories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setReportType(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  reportType === category.id
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.title}
              </button>
            )
          })}
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories
            .find((cat) => cat.id === reportType)
            ?.reports.map((report, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    {report.action}
                  </Button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{report.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{report.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>Last generated: {selectedPeriod}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Collection by Class Chart Preview */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Collection by Class</h2>
            <Button variant="outline" size="sm">
              <PieChart className="w-4 h-4 mr-2" />
              View Chart
            </Button>
          </div>
          <div className="space-y-4">
            {mockReportData.byClass.map((item) => (
              <div key={item.class}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.class}</span>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(item.collected)} / {formatCurrency(item.billed)} ({item.percentage}%)
                  </span>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
