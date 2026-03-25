"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import TeacherSidebar from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"
import { createExam } from "@/lib/api/exam-client"
import { cn } from "@/lib/utils"

type ExamType = 'objective' | 'theory' | 'mixed'

export default function CreateExamPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  // Form state
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [examType, setExamType] = React.useState<ExamType>('objective')
  const [duration, setDuration] = React.useState(60)
  const [subject, setSubject] = React.useState('')
  const [totalMarks, setTotalMarks] = React.useState(100)
  const [passingScore, setPassingScore] = React.useState(40)
  const [instructions, setInstructions] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Exam title is required')
      return
    }

    setIsCreating(true)
    setError(null)

    try {
      await createExam({
        title,
        description,
        type: examType,
        duration,
        totalMarks,
        subject,
        passingScore,
        instructions,
      })

      setSuccess(true)
      
      // Redirect to setup page after 2 seconds
      setTimeout(() => {
        router.push('/teachers/exams/setup')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create exam')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />

        <main className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Exam</h1>
              <p className="text-slate-500">Set up a new examination for your students</p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="font-semibold">Exam created successfully! Redirecting...</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Exam Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Mathematics Midterm Exam"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                      placeholder="Brief description of what this exam covers..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Exam Type */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Exam Type</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'objective', label: 'Objective', icon: 'radio_button_checked', desc: 'Multiple choice questions' },
                    { value: 'theory', label: 'Theory', icon: 'edit_note', desc: 'Essay/short answer' },
                    { value: 'mixed', label: 'Mixed', icon: 'assignment', desc: 'Both types' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setExamType(type.value as ExamType)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-center",
                        examType === type.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <span className="material-symbols-outlined text-2xl mb-2">{type.icon}</span>
                      <p className="text-sm font-semibold">{type.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{type.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Exam Settings</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">
                      Passing Score (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={passingScore}
                      onChange={(e) => setPassingScore(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Mathematics"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Exam Instructions</h3>
                
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Enter any special instructions for students taking this exam..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
                <p className="mt-2 text-xs text-slate-500">
                  These instructions will be displayed to students before they start the exam
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <div className="flex items-center gap-2 text-rose-700">
                    <span className="material-symbols-outlined">error</span>
                    <p className="font-semibold">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-4 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Creating Exam...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">add_circle</span>
                      Create Exam
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
