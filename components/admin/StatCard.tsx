"use client"

import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/api/admin-client"
import { DashboardStats } from "@/lib/api/admin-client"

interface StatCardProps {
  title: string
  value: string | number
  subtext?: string
  icon: string
  color?: "primary" | "amber" | "rose" | "sage" | "blue"
}

export default function StatCard({ title, value, subtext, icon, color = "primary" }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    sage: "bg-sage/10 text-sage",
    blue: "bg-blue-100 text-blue-700",
  }

  const colorClass = colorClasses[color] || colorClasses.primary

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800">
      <div className="flex items-center gap-5">
        <div className={`size-14 rounded-2xl flex items-center justify-center ${colorClass}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-600 dark:text-stone-400">{title}</p>
          <p className="text-2xl font-bold text-stone-900 dark:text-stone-100">{value}</p>
          {subtext && <p className="text-xs text-stone-500 mt-1">{subtext}</p>}
        </div>
      </div>
    </div>
  )
}

export function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        console.log('[StatsGrid] Calling getDashboardStats...')
        const data = await getDashboardStats()
        console.log('[StatsGrid] Got data:', JSON.stringify(data))
        setStats(data)
      } catch (err) {
        console.error('[StatsGrid] Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 animate-pulse">
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-2xl bg-stone-200 dark:bg-stone-700"></div>
              <div className="flex-1">
                <div className="h-4 bg-stone-200 dark:bg-stone-700 rounded w-24 mb-2"></div>
                <div className="h-8 bg-stone-200 dark:bg-stone-700 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
        Error loading stats: {error}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Platform Users",
      value: stats?.totalUsers || 0,
      subtext: stats?.activeUsers ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active` : "No data",
      icon: "group",
      color: "primary" as const,
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers || 0,
      subtext: "Instructors & Professors",
      icon: "person",
      color: "blue" as const,
    },
    {
      title: "Total Subjects",
      value: stats?.totalSubjects || 0,
      subtext: "Active subjects",
      icon: "menu_book",
      color: "sage" as const,
    },
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      subtext: "Active learners",
      icon: "school",
      color: "amber" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
