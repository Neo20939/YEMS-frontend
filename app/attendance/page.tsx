"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { useUser } from "@/contexts/UserContext"
import { getStudentAttendanceHistory, AttendanceRecord } from "@/lib/api/attendance-client"

export default function AttendancePage() {
  const { user, isLoading: userLoading } = useUser()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userLoading && user) {
      loadAttendance()
    }
  }, [user, userLoading])

  const loadAttendance = async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const result = await getStudentAttendanceHistory(user.id)
      setRecords(result.data)
    } catch (error) {
      console.error('Failed to load attendance:', error)
    }
    setIsLoading(false)
  }

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-stone-900">
        <DashboardHeader />
        <div className="flex">
          <StudentSidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const presentCount = records.filter(r => r.status === 'present').length
  const absentCount = records.filter(r => r.status === 'absent').length
  const attendanceRate = records.length > 0 ? (presentCount / records.length) * 100 : 0

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-stone-900">
      <DashboardHeader />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">My Attendance</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Attendance Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{attendanceRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Present</p>
              <p className="text-2xl font-bold text-emerald-600">{presentCount}</p>
            </div>
            <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
              <p className="text-sm text-slate-500">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="p-4 border-b border-stone-200 dark:border-stone-800">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Attendance History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-stone-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600 dark:text-slate-300">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-stone-800">
                      <td className="px-4 py-3 text-sm text-slate-900 dark:text-slate-100">
                        {new Date(record.recordedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                          record.status === 'absent' ? 'bg-red-100 text-red-700' :
                          record.status === 'late' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {record.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                        No attendance records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}