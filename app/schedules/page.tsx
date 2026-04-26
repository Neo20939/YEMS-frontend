"use client"

import { useState, useEffect } from "react"
import { StudentSidebar } from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { useUser } from "@/contexts/UserContext"
import { getStudentTimetable, TimetableDay } from "@/lib/api/schedules-client"

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function SchedulesPage() {
  const { user, isLoading: userLoading } = useUser()
  const [timetable, setTimetable] = useState<TimetableDay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!userLoading && user) {
      loadSchedule()
    }
  }, [user, userLoading])

  const loadSchedule = async () => {
    setIsLoading(true)
    try {
      const result = await getStudentTimetable()
      setTimetable(result.data)
    } catch (error) {
      console.error('Failed to load schedule:', error)
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-stone-900">
      <DashboardHeader />
      <div className="flex">
        <StudentSidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Class Schedule</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {DAYS.map((dayName) => {
              const daySchedule = timetable.find(d => d.dayName === dayName)
              const entries = daySchedule?.entries || []
              
              return (
                <div key={dayName} className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
                  <div className="p-4 bg-primary/10 border-b border-stone-200 dark:border-stone-800">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{dayName}</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {entries.length > 0 ? (
                      entries.map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-stone-800">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                              {entry.subjectName || entry.subjectId}
                            </p>
                            <p className="text-xs text-slate-500">
                              {entry.teacherName || entry.teacherId}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {entry.startTime} - {entry.endTime}
                            </p>
                            {entry.room && (
                              <p className="text-xs text-slate-400">{entry.room}</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 text-center py-4">No classes</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}