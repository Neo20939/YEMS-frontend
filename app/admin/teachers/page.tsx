"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import { useState, useEffect } from "react"
import UserModal from "@/components/admin/UserModal"
import UserTable from "@/components/admin/UserTable"
import TeacherSubjectAssignment from "@/components/admin/TeacherSubjectAssignment"
import ClassTeacherAssignment from "@/components/admin/ClassTeacherAssignment"
import ViewAssignedSubjects from "@/components/admin/ViewAssignedSubjects"
import { getUsers, createUser, updateUserRole, deleteUser, User } from "@/lib/api/admin-client"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"

const availableRoles = [
  { value: "subject_teacher", label: "Subject Teacher", description: "Teacher assigned to teach specific subjects to classes" },
  { value: "class_teacher", label: "Class Teacher", description: "Form teacher responsible for an entire class" },
]

// Helper to check if user is a teacher type
function isTeacher(user: User): boolean {
  const role = String(user.role).toLowerCase()
  console.log('[isTeacher] Checking user:', user.name, 'role:', user.role, 'lowercase:', role)
  return role === 'subject_teacher' || role === 'class_teacher'
}

export default function TeacherManagementPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [teachers, setTeachers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubjectAssignmentOpen, setIsSubjectAssignmentOpen] = useState(false)
  const [isViewSubjectsOpen, setIsViewSubjectsOpen] = useState(false)
  const [isClassAssignmentOpen, setIsClassAssignmentOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [assigningSubjectUser, setAssigningSubjectUser] = useState<User | null>(null)
  const [viewingSubjectUser, setViewingSubjectUser] = useState<User | null>(null)
  const [assigningClassUser, setAssigningClassUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Check authentication on mount
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
    }
  }, [user, userLoading, router])

  useEffect(() => {
    loadTeachers()
  }, [])

  async function loadTeachers() {
    setIsLoading(true)
    try {
      const data = await getUsers()
      console.log('Raw users from API:', data)
      console.log('User roles:', data.map(u => ({ name: u.name, role: u.role })))
      const teachersList = data.filter(isTeacher)
      console.log('Loaded teachers:', teachersList)
      setTeachers(Array.isArray(teachersList) ? teachersList : [])
    } catch (error) {
      console.error('Failed to load teachers:', error)
      setTeachers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTeachers = Array.isArray(teachers) ? teachers.filter((teacher) => {
    const teacherName = teacher.name || ''
    const teacherEmail = teacher.email || ''
    const matchesSearch =
      teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacherEmail.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || (teacher.status || 'active') === statusFilter
    return matchesSearch && matchesStatus
  }) : []

  const handleAddTeacher = async (userData: Omit<User, "id" | "createdAt"> & { password?: string }) => {
    try {
      if (!userData.password) {
        alert('Please enter a password for the new teacher')
        return
      }

      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('You are not logged in. Please log in to create teachers.')
        window.location.href = '/login'
        return
      }

      console.log('Creating teacher with data:', userData)

      // Split name into firstName and lastName
      const nameParts = userData.name?.trim().split(' ')
      const firstName = nameParts?.[0] || ''
      // Ensure lastName is never empty - use firstName if only one name provided
      const lastName = nameParts?.slice(1).join(' ') || nameParts?.[0] || ''

      // Map role string to role ID
      // Backend role IDs: 3 = subject_teacher, 4 = class_teacher
      const roleIdMap: Record<string, number> = {
        'subject_teacher': 3,
        'class_teacher': 4,
      }
      const roleId = roleIdMap[userData.role] || 3

      const newTeacher = await createUser({
        email: userData.email,
        password: userData.password,
        firstName,
        lastName,
        roles: [roleId],
      })
      console.log('Teacher created successfully:', newTeacher)
      setTeachers([...teachers, newTeacher])
      setIsModalOpen(false)
    } catch (error: any) {
      console.error('Failed to create teacher:', error)
      let errorMessage = 'Failed to create teacher. '
      const status = error.response?.status || error.status
      const data = error.response?.data || error
      
      if (status === 401) {
        errorMessage += 'You are not authorized. Please log in again.'
        window.location.href = '/login'
      } else if (status === 400) {
        errorMessage += data?.message || data?.error || 'Invalid data provided.'
      } else if (status === 409) {
        errorMessage += 'Teacher with this email already exists.'
      } else if (status === 500) {
        errorMessage += data?.message || data?.error || 'Server error. Please try again.'
      } else {
        errorMessage += error.message || 'Please try again.'
      }
      alert(errorMessage)
    }
  }

  const handleEditTeacher = async (userData: Omit<User, "id" | "createdAt"> & { password?: string }) => {
    if (!editingUser) return
    try {
      await updateUserRole(editingUser.id, userData.role)
      await loadTeachers()
      setEditingUser(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to update teacher:', error)
      alert('Failed to update teacher. Please try again.')
    }
  }

  const handleDeleteTeacher = async (id: string) => {
    try {
      await deleteUser(id)
      setTeachers(teachers.filter((t) => t.id !== id))
    } catch (error) {
      console.error('Failed to delete teacher:', error)
      alert('Failed to delete teacher. Please try again.')
    }
  }

  const handleAssignSubjects = (teacher: User) => {
    setAssigningSubjectUser(teacher)
    setIsSubjectAssignmentOpen(true)
  }

  const handleViewSubjects = (teacher: User) => {
    setViewingSubjectUser(teacher)
    setIsViewSubjectsOpen(true)
  }

  const handleAssignClass = (teacher: User) => {
    setAssigningClassUser(teacher)
    setIsClassAssignmentOpen(true)
  }

  const openAddModal = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const openEditModal = (teacher: User) => {
    setEditingUser(teacher)
    setIsModalOpen(true)
  }

  // Show loading while checking authentication or loading teachers
  if (userLoading || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // If not authenticated, don't render the page
  if (!user) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Teacher Management
            </h2>
            <p className="text-slate-500 mt-1">
              {teachers.length === 0
                ? "No teachers found in the system."
                : "Add, edit, or remove teacher accounts and assign subjects."}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Teacher
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
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Teachers</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{teachers.length}</p>
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
                  {teachers.filter((t) => t.status === "active").length}
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
                  {teachers.filter((t) => t.status === "pending").length}
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
                  {teachers.filter((t) => t.status === "inactive").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Table */}
        <UserTable
          users={filteredTeachers}
          onEdit={openEditModal}
          onDelete={handleDeleteTeacher}
          onAssignSubjects={handleAssignSubjects}
          onViewSubjects={handleViewSubjects}
          onAssignClass={handleAssignClass}
        />

        {/* Pagination Info */}
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing {filteredTeachers.length} of {teachers.length} teachers
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

      {/* Add/Edit Teacher Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        onSubmit={editingUser ? handleEditTeacher : handleAddTeacher}
        user={editingUser}
        roles={availableRoles}
      />

      {/* Teacher Subject Assignment Modal */}
      {assigningSubjectUser && (
        <TeacherSubjectAssignment
          teacher={assigningSubjectUser}
          onClose={() => {
            setIsSubjectAssignmentOpen(false)
            setAssigningSubjectUser(null)
            loadTeachers()
          }}
        />
      )}

      {/* View Assigned Subjects Modal */}
      {viewingSubjectUser && (
        <ViewAssignedSubjects
          teacher={viewingSubjectUser}
          onClose={() => {
            setIsViewSubjectsOpen(false)
            setViewingSubjectUser(null)
          }}
        />
      )}

      {/* Class Teacher Assignment Modal */}
      {assigningClassUser && (
        <ClassTeacherAssignment
          teacher={assigningClassUser}
          onClose={() => {
            setIsClassAssignmentOpen(false)
            setAssigningClassUser(null)
            loadTeachers()
          }}
        />
      )}
    </AdminLayout>
  )
}
