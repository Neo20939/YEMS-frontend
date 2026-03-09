"use client"

import { useEffect, useState } from "react"
import { getRoles, Role } from "@/lib/api/admin-client"

export default function RolesTable() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await getRoles()
        setRoles(data || [])
      } catch (error) {
        console.error('Failed to load roles:', error)
        setRoles([])
      } finally {
        setIsLoading(false)
      }
    }
    loadRoles()
  }, [])

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm p-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </section>
    )
  }

  if (roles.length === 0) {
    return (
      <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
        <div className="px-6 py-12 text-center">
          <div className="size-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-3xl text-slate-400">admin_panel_settings</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No roles found</h3>
          <p className="text-slate-500 text-sm">Roles will be loaded from the system</p>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/50">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">System Roles List</h3>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-slate-500">filter_list</span>
          </button>
          <button className="p-2 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-slate-500">download</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-slate-400 border-b border-stone-100 dark:border-stone-800">
              <th className="px-6 py-4 font-semibold">Role Name</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Users</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {roles.map((role) => (
              <tr
                key={role.id}
                className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg flex items-center justify-center ${role.iconColor}`}>
                      <span className="material-symbols-outlined text-sm">{role.icon || "badge"}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{role.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{role.description}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{role.users.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                    role.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {role.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                      Permissions
                    </button>
                    <button className="text-slate-500 hover:bg-stone-100 dark:hover:bg-stone-800 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                      Users
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center bg-stone-50/30 dark:bg-stone-800/30">
        <p className="text-sm text-slate-500">Showing {roles.length} roles</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm disabled:opacity-50 text-slate-600 dark:text-slate-400" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm hover:bg-stone-100 dark:hover:bg-stone-800 text-slate-600 dark:text-slate-400 transition-colors" disabled>
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
