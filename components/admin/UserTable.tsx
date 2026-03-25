"use client"

import { User } from "@/lib/api/admin-client"
import { useState } from "react"

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (id: string) => void
  onAssignSubjects?: (user: User) => void
  onViewSubjects?: (user: User) => void
}

export default function UserTable({ users, onEdit, onDelete, onAssignSubjects, onViewSubjects }: UserTableProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const getStatusBadge = (status: User["status"] | undefined) => {
    const safeStatus = status || 'pending' // Default to 'pending' if undefined
    
    const styles = {
      active: "bg-emerald-100 text-emerald-700",
      inactive: "bg-rose-100 text-rose-700",
      pending: "bg-amber-100 text-amber-700",
    }
    const icons = {
      active: "check_circle",
      inactive: "block",
      pending: "schedule",
    }
    const style = styles[safeStatus] || styles.pending
    const icon = icons[safeStatus] || icons.pending
    
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${style}`}
      >
        <span className="material-symbols-outlined text-xs">{icon}</span>
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </span>
    )
  }

  const getRoleBadge = (role: string) => {
    const roleStyles: Record<string, string> = {
      Admin: "bg-primary/10 text-primary",
      Professor: "bg-blue-100 text-blue-700",
      "Department Head": "bg-purple-100 text-purple-700",
      Student: "bg-sage/10 text-sage",
      Guest: "bg-stone-100 text-stone-700",
      teacher: "bg-blue-100 text-blue-700",
      platform_admin: "bg-primary/10 text-primary",
      technician: "bg-amber-100 text-amber-700",
    }
    const style = roleStyles[role] || "bg-stone-100 text-stone-700"
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${style}`}>
        {role}
      </span>
    )
  }

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-12 text-center">
        <div className="size-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-3xl text-slate-400">person_search</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">No users found</h3>
        <p className="text-slate-500 text-sm">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div className="col-span-5">User</div>
        <div className="col-span-2">Role</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-stone-200 dark:divide-stone-800">
        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
          >
            {/* User Info */}
            <div className="col-span-5 flex items-center gap-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-xl">person</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                {user.assignedSubjects && user.assignedSubjects.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1">
                    {user.assignedSubjects.length} subject(s) assigned
                  </p>
                )}
              </div>
            </div>

            {/* Role */}
            <div className="col-span-2">
              <div className="md:hidden text-xs text-slate-500 mb-1">Role</div>
              {getRoleBadge(user.role)}
            </div>

            {/* Status */}
            <div className="col-span-2">
              <div className="md:hidden text-xs text-slate-500 mb-1">Status</div>
              {getStatusBadge(user.status)}
            </div>

            {/* Actions */}
            <div className="col-span-3 flex items-center justify-end gap-2">
              {deleteConfirm === user.id ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-rose-600 font-medium">Sure?</span>
                  <button
                    onClick={() => {
                      onDelete(user.id)
                      setDeleteConfirm(null)
                    }}
                    className="px-3 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-3 py-1.5 bg-stone-200 dark:bg-stone-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <>
                  {user.role === 'teacher' && onViewSubjects && user.assignedSubjects && user.assignedSubjects.length > 0 && (
                    <button
                      onClick={() => onViewSubjects(user)}
                      className="p-2 text-slate-500 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-colors"
                      title="View assigned subjects"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  )}
                  {user.role === 'teacher' && onAssignSubjects && (
                    <button
                      onClick={() => onAssignSubjects(user)}
                      className="p-2 text-slate-500 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
                      title="Assign subjects"
                    >
                      <span className="material-symbols-outlined text-lg">book</span>
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-slate-500 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors"
                    title="Edit user"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(user.id)}
                    className="p-2 text-slate-500 hover:bg-rose-100 hover:text-rose-700 rounded-lg transition-colors"
                    title="Delete user"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
