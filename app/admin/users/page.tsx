"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import { useState, useEffect } from "react"
import UserModal from "@/components/admin/UserModal"
import UserTable from "@/components/admin/UserTable"
import { getUsers, createUser, updateUserRole, deleteUser, User } from "@/lib/api/admin-client"

const availableRoles = [
  { value: "platform_admin", label: "Admin", description: "Full system access" },
  { value: "teacher", label: "Teacher", description: "Create and manage courses" },
  { value: "student", label: "Student", description: "Access enrolled courses" },
  { value: "technician", label: "Technician", description: "System maintenance" },
]

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setIsLoading(true)
    try {
      const data = await getUsers()
      setUsers(data || [])
    } catch (error) {
      console.error('Failed to load users:', error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || (user.status || 'active') === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleAddUser = async (userData: Omit<User, "id" | "createdAt">) => {
    try {
      const newUser = await createUser({
        email: userData.email,
        name: userData.name,
        password: "tempPassword123", // Should be generated or sent via email
        role: userData.role,
      })
      setUsers([...users, newUser])
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user. Please try again.')
    }
  }

  const handleEditUser = async (userData: Omit<User, "id" | "createdAt">) => {
    if (!editingUser) return
    try {
      await updateUserRole(editingUser.id, userData.role)
      await loadUsers() // Reload to get updated data
      setEditingUser(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('Failed to update user. Please try again.')
    }
  }

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id)
      setUsers(users.filter((u) => u.id !== id))
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user. Please try again.')
    }
  }

  const openAddModal = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              User Management
            </h2>
            <p className="text-slate-500 mt-1">
              {users.length === 0 
                ? "No users found in the system." 
                : "Add, edit, or remove users and assign roles to control system access."}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add User
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-100 dark:bg-stone-800 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-stone-100 dark:bg-stone-800 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-slate-100"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">people</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Users</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Active</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pending</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {users.filter((u) => u.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                <span className="material-symbols-outlined">block</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Inactive</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {users.filter((u) => u.status === "inactive").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Table */}
        <UserTable
          users={filteredUsers}
          onEdit={openEditModal}
          onDelete={handleDeleteUser}
        />

        {/* Pagination Info */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-4 py-2 rounded-lg border border-stone-200 dark:border-stone-800 disabled:opacity-50" disabled>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        onSubmit={editingUser ? handleEditUser : handleAddUser}
        user={editingUser}
        roles={availableRoles}
      />
    </AdminLayout>
  )
}
