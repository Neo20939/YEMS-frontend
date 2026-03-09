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
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    sage: "bg-sage/10 text-sage",
    blue: "bg-blue-100 text-blue-700",
  }

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-5 shadow-sm">
      <div className={`size-14 rounded-2xl flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value.toLocaleString()}</h3>
        {subtext && (
          <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${
            subtext.includes("+") ? "text-emerald-600" :
            subtext.includes("!") ? "text-rose-600" :
            "text-slate-400"
          }`}>
            {subtext.includes("trending") && (
              <span className="material-symbols-outlined text-xs">trending_up</span>
            )}
            {subtext.includes("priority") && (
              <span className="material-symbols-outlined text-xs">priority_high</span>
            )}
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

export function StatsGrid() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
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
      title: "Total Students",
      value: stats?.totalStudents || 0,
      subtext: "Active learners",
      icon: "school",
      color: "amber" as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
