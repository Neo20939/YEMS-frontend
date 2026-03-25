"use client"

import { useState, useEffect } from "react"
import AccountantDashboardHeader from "@/components/accountant/DashboardHeader"
import KPICards from "@/components/accountant/KPICards"
import FeeManagementSection from "@/components/accountant/FeeManagementSection"
import TransactionHistory from "@/components/accountant/TransactionHistory"
import QuickActions from "@/components/accountant/QuickActions"
import NextActionsWidget from "@/components/accountant/NextActionsWidget"
import { DashboardKPI, ClassFeeSummary, Transaction, AuditLog } from "@/types/accountant"

// Mock data - will be replaced with API calls
const mockKPIs: DashboardKPI = {
  totalCollected: 45750000,
  totalOutstanding: 28500000,
  collectionRate: 61.6,
  cashBalance: 12350000,
  overdueCount: 87,
  pendingReconciliation: 23,
}

const mockClassSummaries: ClassFeeSummary[] = [
  { class: "JSS1", totalBilled: 12000000, totalCollected: 8400000, totalOutstanding: 3600000, collectionPercentage: 70, studentCount: 100, paidCount: 70 },
  { class: "JSS2", totalBilled: 10500000, totalCollected: 7350000, totalOutstanding: 3150000, collectionPercentage: 70, studentCount: 95, paidCount: 67 },
  { class: "JSS3", totalBilled: 9800000, totalCollected: 6370000, totalOutstanding: 3430000, collectionPercentage: 65, studentCount: 90, paidCount: 59 },
  { class: "SS1", totalBilled: 11200000, totalCollected: 7280000, totalOutstanding: 3920000, collectionPercentage: 65, studentCount: 85, paidCount: 55 },
  { class: "SS2", totalBilled: 10800000, totalCollected: 6480000, totalOutstanding: 4320000, collectionPercentage: 60, studentCount: 80, paidCount: 48 },
  { class: "SS3", totalBilled: 9500000, totalCollected: 5700000, totalOutstanding: 3800000, collectionPercentage: 60, studentCount: 75, paidCount: 45 },
]

const mockTransactions: Transaction[] = [
  { id: "1", paymentId: "PAY-2024-001", studentName: "Chukwuemeka Okafor", class: "SS3", amount: 150000, paymentMethod: "bank_transfer", transactionDate: "2024-03-22T10:30:00", status: "reconciled" },
  { id: "2", paymentId: "PAY-2024-002", studentName: "Fatima Abdullahi", class: "JSS2", amount: 120000, paymentMethod: "card", transactionDate: "2024-03-22T09:15:00", status: "matched" },
  { id: "3", paymentId: "PAY-2024-003", studentName: "Ibrahim Musa", class: "SS1", amount: 180000, paymentMethod: "mobile_money", transactionDate: "2024-03-21T16:45:00", status: "reconciled" },
  { id: "4", paymentId: "PAY-2024-004", studentName: "Blessing Okon", class: "JSS1", amount: 100000, paymentMethod: "cash", transactionDate: "2024-03-21T14:20:00", status: "pending" },
  { id: "5", paymentId: "PAY-2024-005", studentName: "Tobiloba Adeyemi", class: "SS2", amount: 200000, paymentMethod: "bank_transfer", transactionDate: "2024-03-21T11:00:00", status: "reconciled" },
  { id: "6", paymentId: "PAY-2024-006", studentName: "Grace Eze", class: "JSS3", amount: 95000, paymentMethod: "card", transactionDate: "2024-03-20T15:30:00", status: "matched" },
  { id: "7", paymentId: "PAY-2024-007", studentName: "Yusuf Bello", class: "SS1", amount: 175000, paymentMethod: "bank_transfer", transactionDate: "2024-03-20T13:10:00", status: "reconciled" },
  { id: "8", paymentId: "PAY-2024-008", studentName: "Chidinma Nnamdi", class: "JSS2", amount: 110000, paymentMethod: "mobile_money", transactionDate: "2024-03-20T10:45:00", status: "pending" },
  { id: "9", paymentId: "PAY-2024-009", studentName: "Abdulrahman Sani", class: "SS3", amount: 160000, paymentMethod: "cheque", transactionDate: "2024-03-19T16:00:00", status: "matched" },
  { id: "10", paymentId: "PAY-2024-010", studentName: "Precious Okoro", class: "JSS1", amount: 105000, paymentMethod: "bank_transfer", transactionDate: "2024-03-19T14:30:00", status: "reconciled" },
]

const mockNextActions = [
  { id: "1", type: "urgent", title: "Reconcile 23 pending deposits", description: "Bank transfers awaiting matching", priority: "high", link: "/accountant/reconciliation" },
  { id: "2", type: "warning", title: "87 students overdue (30+ days)", description: "Total outstanding: ₦28.5M", priority: "high", link: "/accountant/outstanding" },
  { id: "3", type: "info", title: "Generate monthly report", description: "March 2024 financial report due", priority: "medium", link: "/accountant/reports" },
  { id: "4", type: "info", title: "Review payment plans", description: "5 broken payment plans need attention", priority: "medium", link: "/accountant/fee-management" },
  { id: "5", type: "success", title: "Collection rate improved", description: "Up 3.2% from last month", priority: "low", link: "/accountant/reports" },
]

export default function AccountantDashboard() {
  const [kpis, setKpis] = useState<DashboardKPI>(mockKPIs)
  const [classSummaries, setClassSummaries] = useState<ClassFeeSummary[]>(mockClassSummaries)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [nextActions, setNextActions] = useState(mockNextActions)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-12">
      <AccountantDashboardHeader />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8">
        {/* KPI Cards */}
        <KPICards kpis={kpis} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Fee Management Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <FeeManagementSection classSummaries={classSummaries} />
          </div>

          {/* Quick Actions & Next Actions */}
          <div className="space-y-8">
            <QuickActions />
            <NextActionsWidget actions={nextActions} />
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
