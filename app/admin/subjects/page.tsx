"use client"

import * as React from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  type Subject,
} from "@/lib/api/admin-client"
import { cn } from "@/lib/utils"

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = React.useState<Subject[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreating, setIsCreating] = React.useState(false)
  const [editingSubject, setEditingSubject] = React.useState<Subject | null>(null)
  const [showForm, setShowForm] = React.useState(false)

  // Form state
  const [name, setName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [status, setStatus] = React.useState<'active' | 'inactive'>('active')
  const [error, setError] = React.useState<string | null>(null)

  // Abort controller for cleanup
  const abortControllerRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => {
    loadSubjects()

    // Cleanup: abort any pending request when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  async function loadSubjects() {
    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    setError(null)
    try {
      // Pass signal to API call if supported
      const response = await getSubjects()
      setSubjects(response.data)
    } catch (err: any) {
      // Ignore abort errors - they're expected when component unmounts or request is cancelled
      if (err.name === 'AbortError' || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return
      }
      console.error('Failed to load subjects:', err)
      setError(err.message || 'Failed to load subjects. Please ensure the backend API is available.')
      setSubjects([])
    } finally {
      setIsLoading(false)
    }
  }

  function resetForm() {
    setName('')
    setCode('')
    setDescription('')
    setError(null)
    setEditingSubject(null)
    setShowForm(false)
  }

  function handleEdit(subject: Subject) {
    setEditingSubject(subject)
    setName(subject.name)
    setCode(subject.code)
    setDescription(subject.description || '')
    setStatus(subject.status)
    setShowForm(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this subject?')) return

    try {
      await deleteSubject(id)
      setSubjects(subjects.filter(s => s.id !== id))
    } catch (err: any) {
      console.error('Failed to delete subject:', err)
      alert(err.message || 'Failed to delete subject. Please try again.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim() || !code.trim()) {
      setError('Name and code are required')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      if (editingSubject) {
        const updated = await updateSubject(editingSubject.id, {
          name,
          code,
          description,
          status,
        })
        await loadSubjects()
      } else {
        await createSubject({
          name,
          code,
          description,
        })
        await loadSubjects()
      }
      resetForm()
    } catch (err: any) {
      console.error('Failed to save subject:', err)
      setError(err.message || 'Failed to save subject. Please ensure the backend API is available.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Subject Management
            </h2>
            <p className="text-slate-500 mt-1">
              Create and manage subjects for your institution
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Add Subject
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">
                  {editingSubject ? 'Edit Subject' : 'Create New Subject'}
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-500">close</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Mathematics"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g., MATH101"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the subject..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>

                {editingSubject && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Status
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStatus('active')}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border-2 font-semibold transition-all",
                          status === 'active'
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-600"
                        )}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus('inactive')}
                        className={cn(
                          "flex-1 py-2.5 rounded-xl border-2 font-semibold transition-all",
                          status === 'inactive'
                            ? "border-slate-500 bg-slate-100 text-slate-700"
                            : "border-slate-200 text-slate-600"
                        )}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50"
                  >
                    {isCreating ? 'Saving...' : editingSubject ? 'Update Subject' : 'Create Subject'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Subjects Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-3 text-slate-500">Loading subjects...</p>
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">folder_open</span>
                      <p className="text-slate-500 font-medium">No subjects yet</p>
                      <p className="text-slate-400 text-sm mt-1">Click "Add Subject" to create one</p>
                    </td>
                  </tr>
                ) : (
                  subjects.map((subject) => (
                    <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-900">{subject.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-mono font-medium">
                          {subject.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-500 text-sm">
                          {subject.description || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "inline-flex px-3 py-1 rounded-full text-xs font-semibold",
                            subject.status === 'active'
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {subject.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(subject)}
                            className="p-2 text-slate-400 hover:text-primary transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
