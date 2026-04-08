"use client"

import { useState, useEffect, useRef } from "react"
import { User, Subject, getSubjects, getTeacherAssignedSubjects } from "@/lib/api/admin-client"
import { createTeacherSubjectAssignment, getAcademicYears, AcademicYear, getClasses, Class } from "@/lib/api/academic-client"

interface TeacherSubjectAssignmentProps {
  teacher: User
  onClose: () => void
}

export default function TeacherSubjectAssignment({
  teacher,
  onClose,
}: TeacherSubjectAssignmentProps) {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [academicYearId, setAcademicYearId] = useState<string>("")
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState<string>("")
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
      // Load academic years, then classes and subjects in parallel
      const [yearsData, allSubjects, classesData] = await Promise.all([
        getAcademicYears(),
        getSubjects(),
        getClasses({ limit: 100 }),
      ])
      
      setAcademicYears(yearsData)
      // Auto-select current academic year if available
      const safeYears = Array.isArray(yearsData) ? yearsData : []
      const currentYear = safeYears.find((y: AcademicYear) => y.isCurrent)
      if (currentYear) {
        setAcademicYearId(currentYear.id)
      } else if (safeYears.length > 0) {
        setAcademicYearId(safeYears[0].id)
      }
      
      setSubjects(allSubjects)
      setClasses(classesData.classes || [])
      
      // Get assigned subjects
      const assignedSubjects = await getTeacherAssignedSubjects(teacher.id)
      setSelectedSubjects(assignedSubjects.map(s => s.id))
    } catch (error: any) {
      if (error.name === 'AbortError' || error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        return
      }
      console.error('Failed to load data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  function toggleSubject(subjectId: string) {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    )
    setSaved(false)
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
      // Create a teacher subject assignment for each selected subject
      for (const subjectId of selectedSubjects) {
        await createTeacherSubjectAssignment({
          teacherId: teacher.id,
          classId: selectedClass,
          subjectId,
          academicYearId,
        })
      }
      setSaved(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (error) {
      console.error('Failed to assign subjects:', error)
      alert('Failed to assign subjects. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-stone-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Assign Subjects to Teacher
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
              <p className="mt-4 text-slate-500">Loading subjects...</p>
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">folder_open</span>
              <p className="text-slate-500 font-medium">No subjects available</p>
              <p className="text-sm text-slate-400 mt-1">Create subjects first in the Subject Management page</p>
            </div>
          ) : (
            <div>
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
                        {cls.name} {cls.level} {cls.stream ? `(${cls.stream})` : ''}
                      </option>
                    ))}
                  </select>
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

              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Select subjects this teacher can manage:
                </p>
                <span className="text-sm text-slate-500">
                  {selectedSubjects.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => toggleSubject(subject.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                      selectedSubjects.includes(subject.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {subject.name}
                      </p>
                      <p className="text-xs text-slate-500 font-mono">{subject.code}</p>
                    </div>
                    {selectedSubjects.includes(subject.id) && (
                      <span className="material-symbols-outlined text-primary">
                        check_circle
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          {saved && (
            <div className="flex items-center gap-2 text-emerald-600">
              <span className="material-symbols-outlined">check_circle</span>
              <span className="text-sm font-medium">Subjects assigned successfully!</span>
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
              disabled={isSaving || isLoading}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Assignments'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
