"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import { StatsGrid } from "@/components/admin/StatCard"
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"

export default function AdminDashboardPage() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const displayName = user?.name || "Admin"

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Admin Dashboard
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome back, {displayName}. Here's what's happening with your platform today.
            </p>
          </div>
        </div>

        {/* Dashboard Overview Stats */}
        <StatsGrid />

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/roles"
            className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">shield_person</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Roles & Permissions</h3>
                <p className="text-sm text-slate-500">Manage access controls</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/users"
            className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">group</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">User Management</h3>
                <p className="text-sm text-slate-500">Add or remove users</p>
              </div>
            </div>
          </Link>
          <Link
            href="/admin/audit-logs"
            className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">history_edu</span>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100">Audit Logs</h3>
                <p className="text-sm text-slate-500">View system activity</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
