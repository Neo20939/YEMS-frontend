"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import { StatsGrid } from "@/components/admin/StatCard"
import RolesTable from "@/components/admin/RolesTable"
import PermissionsMatrix from "@/components/admin/PermissionsMatrix"
import Link from "next/link"

export default function AdminRolesPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Title & CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Roles & Permissions
            </h2>
            <p className="text-slate-500 mt-1">
              Configure global access controls and manage administrative hierarchies.
            </p>
          </div>
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">add</span>
            Create New Role
          </button>
        </div>

        {/* Dashboard Overview Stats */}
        <StatsGrid />

        {/* Role Management Table */}
        <RolesTable />

        {/* Permissions Matrix */}
        <PermissionsMatrix />
      </div>
    </AdminLayout>
  )
}
