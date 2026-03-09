"use client"

import { useState, useEffect } from "react"
import { User } from "@/app/admin/users/page"

interface Role {
  value: string
  label: string
  description: string
}

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (userData: Omit<User, "id" | "createdAt">) => void
  user: User | null
  roles: Role[]
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  roles,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    status: "active" as User["status"],
    department: "",
    avatar: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role.toLowerCase().replace(/\s+/g, "_"),
        status: user.status,
        department: user.department,
        avatar: user.avatar || "",
      })
    } else {
      setFormData({
        name: "",
        email: "",
        role: "student",
        status: "active",
        department: "",
        avatar: "",
      })
    }
  }, [user, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const roleLabel = roles.find((r) => r.value === formData.role)?.label || formData.role
    onSubmit({
      ...formData,
      role: roleLabel,
      avatar: formData.avatar || `https://i.pravatar.cc/150?u=${Date.now()}`,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-md shadow-2xl border border-stone-200 dark:border-stone-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">
                {user ? "edit" : "person_add"}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {user ? "Edit User" : "Add New User"}
              </h3>
              <p className="text-xs text-slate-500">
                {user ? "Update user information" : "Create a new user account"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                person
              </span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                email
              </span>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                placeholder="Enter email address"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Role
            </label>
            <div className="space-y-1.5">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    formData.role === role.value
                      ? "border-primary bg-primary/5"
                      : "border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="size-4 text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {role.label}
                    </p>
                    <p className="text-[10px] text-slate-500">{role.description}</p>
                  </div>
                  {formData.role === role.value && (
                    <span className="material-symbols-outlined text-primary text-base">
                      check_circle
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Status
            </label>
            <div className="flex gap-2">
              {(["active", "inactive", "pending"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFormData({ ...formData, status })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    formData.status === status
                      ? status === "active"
                        ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500"
                        : status === "inactive"
                        ? "bg-rose-100 text-rose-700 ring-2 ring-rose-500"
                        : "bg-amber-100 text-amber-700 ring-2 ring-amber-500"
                      : "bg-stone-100 dark:bg-stone-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Department
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                business
              </span>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                placeholder="Enter department"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm"
            >
              {user ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
