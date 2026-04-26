"use client"

import AdminLayout from "@/components/admin/AdminLayout"
import { useState, useEffect } from "react"
import UserModal from "@/components/admin/UserModal"
import UserTable from "@/components/admin/UserTable"
import TeacherSubjectAssignment from "@/components/admin/TeacherSubjectAssignment"
import { getUsers, createUser, updateUserRole, deleteUser, User } from "@/lib/api/admin-client"
import { useUser } from "@/contexts/UserContext"
import { useRouter } from "next/navigation"

const availableRoles = [
  { value: "student", label: "Student", description: "Access courses and submit work" },
]

export default function StudentManagementPage() {
  const router = useRouter()
  const { user, isLoading: userLoading } = useUser()
  const [students, setStudents] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")


  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login')
    }
  }, [user, userLoading, router])

  useEffect(() => {
    loadStudents()
  }, [])

  async function loadStudents() {
    setIsLoading(true)
    try {
      const data = await getUsers()
      const studentsList = data.filter(u => u.role === 'student')
      console.log('Loaded students:', studentsList)
      setStudents(Array.isArray(studentsList) ? studentsList : [])
    } catch (error) {
      console.error('Failed to load students:', error)
      setStudents([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStudents = Array.isArray(students) ? students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || (student.status || 'active') === statusFilter
    return matchesSearch && matchesStatus
  }) : []

  const handleAddStudent = async (userData: Omit<User, "id" | "createdAt"> & { password?: string }) => {
    try {
      if (!userData.password) {
        alert('Please enter a password for the new student')
        return
      }

      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('You are not logged in. Please log in to create students.')
        window.location.href = '/login'
        return
      }

      console.log('Creating student with data:', userData)
       const nameParts = userData.name.split(' ');
       const firstName = nameParts[0] || '';
       const lastName = nameParts.slice(1).join(' ') || '';

       const newStudent = await createUser({
         email: userData.email,
         firstName: firstName,
         lastName: lastName,
         password: userData.password,
         roles: [6], // student role id
       }, 'students')
      console.log('Student created successfully:', newStudent)
      setStudents([...students, newStudent])
      setIsModalOpen(false)
    } catch (error: any) {
      console.error('Failed to create student:', error)
      let errorMessage = 'Failed to create student. '
      if (error.response?.status === 401) {
        errorMessage += 'You are not authorized. Please log in again.'
        window.location.href = '/login'
      } else if (error.response?.status === 400) {
        errorMessage += error.response?.data?.message || 'Invalid data provided.'
      } else if (error.response?.status === 409) {
        errorMessage += 'Student with this email already exists.'
      } else {
        errorMessage += error.message || 'Please try again.'
      }
      alert(errorMessage)
    }
  }

  const handleEditStudent = async (userData: Omit<User, "id" | "createdAt"> & { password?: string }) => {
    if (!editingUser) return
    try {
      await updateUserRole(editingUser.id, 'student')
      await loadStudents()
      setEditingUser(null)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Failed to update student:', error)
      alert('Failed to update student. Please try again.')
    }
  }

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteUser(id)
      setStudents(students.filter((s) => s.id !== id))
    } catch (error) {
      console.error('Failed to delete student:', error)
      alert('Failed to delete student. Please try again.')
    }
  }

  const openAddModal = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const openEditModal = (student: User) => {
    setEditingUser(student)
    setIsModalOpen(true)
  }

  
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

 
  if (!user) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Student Management
            </h2>
            <p className="text-slate-500 mt-1">
              {students.length === 0
                ? "No students found in the system."
                : "Add, edit, or remove student accounts."}
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add Student
          </button>
        </div>

        
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

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Students</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{students.length}</p>
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
                  {students.filter((s) => s.status === "active").length}
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
                  {students.filter((s) => s.status === "pending").length}
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
                  {students.filter((s) => s.status === "inactive").length}
                </p>
              </div>
            </div>
          </div>
        </div>

       
        <UserTable
          users={filteredStudents}
          onEdit={openEditModal}
          onDelete={handleDeleteStudent}
        />

        
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Showing {filteredStudents.length} of {students.length} students
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

      
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingUser(null)
        }}
        onSubmit={editingUser ? handleEditStudent : handleAddStudent}
        user={editingUser}
        roles={availableRoles}
        lockedRole="student"
      />
    </AdminLayout>
  )
}
