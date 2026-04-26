"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"
import { getFeeRecords, getTermFeeStats, FeeRecord, FeeStats } from "@/lib/api/finance-client"

export default function FinanceDashboardPage() {
  const { user, isLoading: userLoading } = useUser()
  const router = useRouter()
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([])
  const [stats, setStats] = useState<FeeStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTerm, setSelectedTerm] = useState<string>("")

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
    }
  }, [user, userLoading, router])

  useEffect(() => {
    loadData()
  }, [selectedTerm])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [recordsRes, statsRes] = await Promise.all([
        getFeeRecords({ limit: 20 }),
        selectedTerm ? getTermFeeStats(selectedTerm) : Promise.resolve(null)
      ])
      setFeeRecords(recordsRes.data)
      if (statsRes) setStats(statsRes)
    } catch (error) {
      console.error('Failed to load finance data:', error)
    }
    setIsLoading(false)
  }

  if (userLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Finance Dashboard</h1>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Total Expected</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                ₦{stats.totalExpected.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Total Collected</p>
              <p className="text-2xl font-bold text-emerald-600">
                ₦{stats.totalCollected.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Outstanding</p>
              <p className="text-2xl font-bold text-red-600">
                ₦{stats.totalOutstanding.toLocaleString()}
              </p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Collection Rate</p>
              <p className="text-2xl font-bold text-primary">
                {stats.collectionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Recent Fee Records</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-stone-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Student</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Class</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Paid</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Balance</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                {feeRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-stone-800">
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                      {record.studentName || record.studentId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                      {record.className || record.classId}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                      ₦{record.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-emerald-600">
                      ₦{record.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600">
                      ₦{record.balance.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        record.status === 'partial' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}