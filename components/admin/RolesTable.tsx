"use client"

import { Role } from "@/types/admin"

const roles: Role[] = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access and master configuration authority.",
    users: 4,
    status: "active",
    icon: "security",
    iconColor: "bg-primary/10 text-primary",
  },
  {
    id: "2",
    name: "Teacher",
    description: "Manage courses, assignments, and student grading.",
    users: 842,
    status: "active",
    icon: "person",
    iconColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "3",
    name: "Registrar",
    description: "Student enrollment, record keeping, and scheduling.",
    users: 12,
    status: "active",
    icon: "app_registration",
    iconColor: "bg-amber-100 text-amber-700",
  },
  {
    id: "4",
    name: "Student",
    description: "View notes, submit assignments, and take exams.",
    users: 11624,
    status: "active",
    icon: "school",
    iconColor: "bg-stone-100 text-stone-700",
  },
]

export default function RolesTable() {
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
                      <span className="material-symbols-outlined text-sm">{role.icon}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{role.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{role.description}</td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{role.users.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-tight">
                    Active
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
        <p className="text-sm text-slate-500">Showing 4 of 14 roles</p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm disabled:opacity-50 text-slate-600 dark:text-slate-400" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm hover:bg-stone-100 dark:hover:bg-stone-800 text-slate-600 dark:text-slate-400 transition-colors">
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
