"use client"

import { useState, useEffect, useRef } from "react"
import { User } from "@/lib/api/admin-client"
import { 
  createClassTeacherAssignment, 
  getAcademicYears, 
  getClasses, 
  getClassTeacherAssignments,
  AcademicYear, 
  AcademicClass 
} from "@/lib/api/academic-client"

interface ClassTeacherAssignmentProps {
  teacher: User
  onClose: () => void
}

export default function ClassTeacherAssignment({
  teacher,
  onClose,
}: ClassTeacherAssignmentProps) {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [academicYearId, setAcademicYearId] = useState<string>("")
  const [classes, setClasses] = useState<AcademicClass[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [currentAssignment, setCurrentAssignment] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    loadData()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [teacher.id])

  async function loadData() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()

    setIsLoading(true)
    try {
      // Load academic years, classes, and current assignment in parallel
      const [yearsResult, classesResult, assignmentsData] = await Promise.all([
        getAcademicYears(),
        getClasses({ limit: 100 }),
        getClassTeacherAssignments(),
      ])
      
      // Handle wrapped responses
      const yearsData = Array.isArray(yearsResult) ? yearsResult : (yearsResult?.data || [])
      const classesData = Array.isArray(classesResult) ? classesResult : (classesResult?.data || [])
      
      // Set academic years
      setAcademicYears(yearsData)
      
      // Auto-select current academic year if available
      const currentYear = yearsData.find((y: AcademicYear) => y.isCurrent)
      if (currentYear) {
        setAcademicYearId(currentYear.id)
      } else if (yearsData.length > 0) {
        setAcademicYearId(yearsData[0].id)
      }
      
      // Set classes
      setClasses(classesData as AcademicClass[])
      
      // Find current class teacher assignment for this teacher
      const safeAssignments = Array.isArray(assignmentsData) ? assignmentsData : []
      const teacherAssignment = safeAssignments.find((a: any) => a.teacherId === teacher.id)
      if (teacherAssignment) {
        setCurrentAssignment(teacherAssignment)
        setSelectedClass(teacherAssignment.classId)
      }
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return
      }
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave() {
    if (!academicYearId) {
      alert('Please select an academic year')
      return
    }

    if (!selectedClass) {
      alert('Please select a class')
      return
    }

    setIsSaving(true)
    try {
      await createClassTeacherAssignment({
        teacherId: teacher.id,
        classId: selectedClass,
        academicYearId,
      })
      setSaved(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Failed to assign class:', error)
      alert('Failed to assign class. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Assign Class to Class Teacher
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {teacher.name} ({teacher.email})
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
              <p className="mt-4 text-slate-500">Loading...</p>
            </div>
          ) : (
            <div>
              {/* Current Assignment Info */}
              {currentAssignment && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 mb-2">
                    <span className="material-symbols-outlined">check_circle</span>
                    <span className="font-semibold">Currently Assigned</span>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">
                    Class: <span className="font-medium">{currentAssignment.className}</span>
                  </p>
                </div>
              )}

              {/* Academic Year Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Academic Year
                </label>
                <select
                  value={academicYearId}
                  onChange={(e) => setAcademicYearId(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select academic year...</option>
                  {academicYears.map((year) => (
                    <option key={year.id} value={year.id}>
                      {year.name} {year.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class Selection */}
              {classes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="">Select a class...</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {classes.length === 0 && (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">class</span>
                  <p className="text-slate-500 font-medium">No classes available</p>
                  <p className="text-sm text-slate-400 mt-1">Create classes first in the Academic section</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="text-sm font-medium">Class assigned successfully!</span>
            </div>
          )}
          <div className="flex gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-stone-200 dark:border-stone-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isLoading || classes.length === 0}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : currentAssignment ? 'Update Assignment' : 'Assign Class'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}