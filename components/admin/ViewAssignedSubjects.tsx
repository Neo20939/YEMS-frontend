"use client"

import { useState, useEffect, useRef } from "react"
import { User, Subject, getSubjects, getTeacherAssignedSubjects } from "@/lib/api/admin-client"

interface ViewAssignedSubjectsProps {
  teacher: User
  onClose: () => void
}

export default function ViewAssignedSubjects({
  teacher,
  onClose,
}: ViewAssignedSubjectsProps) {
  const [assignedSubjects, setAssignedSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    loadAssignedSubjects()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [teacher.id])

  async function loadAssignedSubjects() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    try {
      const [subjectsResult, assignedSubjectsList] = await Promise.all([
        getSubjects(),
        getTeacherAssignedSubjects(teacher.id),
      ])

      // Handle wrapped response
      const allSubjects = Array.isArray(subjectsResult) ? subjectsResult : (subjectsResult?.data || [])
      const assignedIds = assignedSubjectsList.map(s => s.id)
      const subjects = allSubjects.filter(s => assignedIds.includes(s.id))
      setAssignedSubjects(subjects)
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return
      }
      console.error('Failed to load assigned subjects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Assigned Subjects
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {teacher.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors"
          >
            <span className="material-symbols-outlined text-slate-500">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-slate-500">Loading subjects...</p>
            </div>
          ) : assignedSubjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="size-16 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl text-slate-400">book</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                No subjects assigned
              </h3>
              <p className="text-sm text-slate-500">
                This teacher has not been assigned any subjects yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {assignedSubjects.length} subject(s) assigned
                </p>
              </div>

              {assignedSubjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {subject.name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {subject.code}
                    </p>
                  </div>
                  {subject.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                      <span className="material-symbols-outlined text-xs">block</span>
                      Inactive
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
