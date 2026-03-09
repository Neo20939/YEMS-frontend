"use client"

import { PermissionMatrix as PermissionMatrixType } from "@/types/admin"

const permissions: PermissionMatrixType[] = [
  { permission: "Upload Course Notes", superAdmin: true, teacher: true, student: false, registrar: false },
  { permission: "Grade Assignments", superAdmin: true, teacher: true, student: false, registrar: false },
  { permission: "Create Exams", superAdmin: true, teacher: true, student: false, registrar: false },
  { permission: "Manage User Accounts", superAdmin: true, teacher: false, student: false, registrar: true },
  { permission: "View Financials", superAdmin: true, teacher: false, student: false, registrar: false },
  { permission: "Course Registration", superAdmin: true, teacher: false, student: true, registrar: true },
]

export default function PermissionsMatrix() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Permissions Matrix</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Overview</p>
      </div>
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-x-auto shadow-sm">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-stone-50 dark:bg-stone-800/50">
              <th className="px-6 py-4 text-left font-bold text-slate-600 dark:text-slate-300 border-r border-stone-100 dark:border-stone-800 min-w-[200px]">
                Permission
              </th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-tight text-primary">Super Admin</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-tight text-slate-500">Teacher</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-tight text-slate-500">Student</th>
              <th className="px-4 py-4 text-xs font-bold uppercase tracking-tight text-slate-500">Registrar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {permissions.map((row, index) => (
              <tr key={index} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                <td className="px-6 py-4 text-left font-medium border-r border-stone-100 dark:border-stone-800 text-slate-700 dark:text-slate-300">
                  {row.permission}
                </td>
                <td className="px-4 py-4">
                  {row.superAdmin ? (
                    <span className="material-symbols-outlined text-primary font-bold">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-200 dark:text-slate-700">cancel</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {row.teacher ? (
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-200 dark:text-slate-700">cancel</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {row.student ? (
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-200 dark:text-slate-700">cancel</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  {row.registrar ? (
                    <span className="material-symbols-outlined text-emerald-500">check_circle</span>
                  ) : (
                    <span className="material-symbols-outlined text-slate-200 dark:text-slate-700">cancel</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
