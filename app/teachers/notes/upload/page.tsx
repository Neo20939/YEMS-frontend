"use client"

import React, { useState, useEffect } from "react"
import TeacherSidebar from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"
import { FileUploadZone, UploadProgress, useToast, ToastContainer } from "@/components/ui"
import {
  uploadNote,
  getNotes,
  deleteNote,
  downloadNote,
  getAvailableSubjects,
  getAvailableClassGrades,
  getTeacherAssignedSubjects,
  canTeacherManageSubject,
} from "@/lib/api/notes-client"
import type { Note, NoteSubject, NoteClassGrade, NoteTerm, CreateNoteRequest } from "@/lib/api/types"
import { Download, Edit, Trash2, Search, Filter, Calendar, FileText, Lock } from "lucide-react"
import { useUser } from "@/contexts/UserContext"

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "video/mp4",
  "audio/mpeg",
]

const TERM_OPTIONS: { value: NoteTerm; label: string }[] = [
  { value: "first-term", label: "First Term" },
  { value: "second-term", label: "Second Term" },
  { value: "third-term", label: "Third Term" },
]

export default function NotesUploadPage() {
  const { toasts, toast, removeToast } = useToast()
  const { user } = useUser()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [subject, setSubject] = useState<NoteSubject>("")
  const [classGrade, setClassGrade] = useState<NoteClassGrade>("")
  const [term, setTerm] = useState<NoteTerm>("first-term")
  const [week, setWeek] = useState("")
  const [topic, setTopic] = useState("")
  const [tags, setTags] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  // Notes list state
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoadingNotes, setIsLoadingNotes] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterClass, setFilterClass] = useState("")

  // Options state
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([])
  const [availableClassGrades, setAvailableClassGrades] = useState<string[]>([])
  
  // RBAC state
  const [assignedSubjects, setAssignedSubjects] = useState<string[]>([])
  const [hasNoSubjects, setHasNoSubjects] = useState(false)

  // Load available options and notes on mount
  useEffect(() => {
    loadOptions()
    loadNotes()
    loadAssignedSubjects()
  }, [])

  const loadAssignedSubjects = () => {
    const subjects = getTeacherAssignedSubjects()
    setAssignedSubjects(subjects)
    
    // Check if teacher has no assigned subjects
    if (user?.role === 'teacher' && subjects.length === 0) {
      setHasNoSubjects(true)
    } else {
      setHasNoSubjects(false)
    }
  }

  const loadOptions = async () => {
    const [subjectsResult, gradesResult] = await Promise.all([
      getAvailableSubjects(),
      getAvailableClassGrades(),
    ])

    if (subjectsResult.success && subjectsResult.data) {
      setAvailableSubjects(subjectsResult.data)
    }
    if (gradesResult.success && gradesResult.data) {
      setAvailableClassGrades(gradesResult.data)
    }
  }

  const loadNotes = async () => {
    setIsLoadingNotes(true)
    const result = await getNotes()
    if (result.success && result.data) {
      setNotes(result.data.notes)
    } else {
      toast.error("Failed to load notes")
    }
    setIsLoadingNotes(false)
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    setUploadStatus("idle")
    setErrorMessage("")
  }

  const handleFileClear = () => {
    setSelectedFile(null)
    setUploadStatus("idle")
    setErrorMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    if (!title || !subject || !classGrade) {
      toast.error("Please fill in all required fields")
      return
    }

    // RBAC check: Verify teacher can upload for this subject
    if (user?.role === 'teacher' && !canTeacherManageSubject(subject)) {
      toast.error("You are not authorized to upload notes for this subject")
      return
    }

    setUploadStatus("uploading")
    setUploadProgress(0)

    const payload: CreateNoteRequest = {
      title,
      description: description || undefined,
      subject,
      classGrade,
      term,
      week: week || undefined,
      topic: topic || undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean) || undefined,
      file: selectedFile,
    }

    const result = await uploadNote(payload, (progress) => {
      setUploadProgress(progress)
    })

    if (result.success && result.data) {
      setUploadStatus("success")
      toast.success("Note uploaded successfully!")
      setTitle("")
      setDescription("")
      setSubject("")
      setClassGrade("")
      setWeek("")
      setTopic("")
      setTags("")
      setSelectedFile(null)
      setUploadProgress(0)

      // Reload notes list
      setTimeout(() => {
        loadNotes()
        setUploadStatus("idle")
      }, 1500)
    } else {
      setUploadStatus("error")
      setErrorMessage(result.error?.message || "Upload failed")
      toast.error(result.error?.message || "Failed to upload note")
    }
  }

  const handleDelete = async (noteId: string, noteTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${noteTitle}"?`)) return

    const result = await deleteNote(noteId)
    if (result.success) {
      toast.success("Note deleted successfully")
      loadNotes()
    } else {
      toast.error(result.error?.message || "Failed to delete note")
    }
  }

  const handleDownload = async (note: Note) => {
    const result = await downloadNote(note.id)
    if (result.success && result.data) {
      toast.success("Download started")
    } else {
      toast.error("Failed to download note")
    }
  }

  // Filter notes based on search and filters
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = !filterSubject || note.subject === filterSubject
    const matchesClass = !filterClass || note.classGrade === filterClass
    return matchesSearch && matchesSubject && matchesClass
  })

  return (
    <div className="min-h-screen bg-background-light">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />

        {/* Hero Section */}
        <div className="bg-primary pt-8 pb-32 px-8 relative z-0">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-white"></span>
              <span className="text-sm font-medium text-white">Academic Session 2024/2025</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Notes Management</h2>
            <p className="text-white/80 text-lg">Upload new study materials and manage existing class notes.</p>
          </div>
        </div>

        <main className="flex-1 px-8 -mt-20 relative z-10 pb-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Upload Form Section */}
            <section className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Upload New Note</h3>
              </div>

              {/* RBAC Warning Banner */}
              {hasNoSubjects && user?.role === 'teacher' && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">No Subjects Assigned</h4>
                    <p className="text-sm text-amber-700">
                      You haven't been assigned any subjects yet. Please contact your administrator to assign subjects to you before uploading notes.
                    </p>
                  </div>
                </div>
              )}

              {assignedSubjects.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm font-medium text-blue-800 mb-2">Your Assigned Subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {assignedSubjects.map((subj) => (
                      <span key={subj} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium capitalize">
                        {subj.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload File <span className="text-red-500">*</span>
                  </label>
                  <FileUploadZone
                    file={selectedFile}
                    onFileSelect={handleFileSelect}
                    onFileClear={handleFileClear}
                    acceptedFileTypes={ACCEPTED_FILE_TYPES}
                    maxFileSize={50}
                    disabled={uploadStatus === "uploading"}
                  />
                </div>

                {/* Upload Progress */}
                {uploadStatus !== "idle" && selectedFile && (
                  <UploadProgress
                    progress={uploadProgress}
                    status={uploadStatus}
                    fileName={selectedFile.name}
                    fileSize={selectedFile.size}
                    errorMessage={errorMessage}
                    onCancel={() => {
                      setUploadStatus("idle")
                      setUploadProgress(0)
                    }}
                  />
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Title - Full Width */}
                  <div className="space-y-2 col-span-1 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="noteTitle">
                      Note Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                      id="noteTitle"
                      placeholder="e.g. Introduction to Algebra"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      disabled={uploadStatus === "uploading"}
                      required
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="subject">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors disabled:bg-gray-100"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value as NoteSubject)}
                      disabled={uploadStatus === "uploading" || hasNoSubjects}
                      required
                    >
                      <option disabled value="">Select Subject</option>
                      {availableSubjects.map((subj) => (
                        <option key={subj} value={subj}>
                          {subj.charAt(0).toUpperCase() + subj.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                    {hasNoSubjects && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Subject selection disabled - no subjects assigned
                      </p>
                    )}
                  </div>

                  {/* Class/Grade */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="classGrade">
                      Class / Grade <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                      id="classGrade"
                      value={classGrade}
                      onChange={(e) => setClassGrade(e.target.value as NoteClassGrade)}
                      disabled={uploadStatus === "uploading"}
                      required
                    >
                      <option disabled value="">Select Class</option>
                      {availableClassGrades.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade.charAt(0).toUpperCase() + grade.slice(1).replace("-", " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Term */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="term">
                      Term
                    </label>
                    <select
                      className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                      id="term"
                      value={term}
                      onChange={(e) => setTerm(e.target.value as NoteTerm)}
                      disabled={uploadStatus === "uploading"}
                    >
                      {TERM_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Week */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="week">
                      Week
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                      id="week"
                      placeholder="e.g. 01, 02"
                      type="text"
                      value={week}
                      onChange={(e) => setWeek(e.target.value)}
                      disabled={uploadStatus === "uploading"}
                    />
                  </div>

                  {/* Topic */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="topic">
                      Topic
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                      id="topic"
                      placeholder="e.g. Basic Concepts"
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      disabled={uploadStatus === "uploading"}
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700" htmlFor="tags">
                      Topic Tags
                    </label>
                    <input
                      className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                      id="tags"
                      placeholder="e.g. basics, overview, introduction"
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      disabled={uploadStatus === "uploading"}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-lg border-gray-200 bg-transparent text-gray-900 focus:ring-primary focus:border-primary transition-colors resize-none"
                    id="description"
                    placeholder="Brief description of the note content..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={uploadStatus === "uploading"}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setTitle("")
                      setDescription("")
                      setSubject("")
                      setClassGrade("")
                      setWeek("")
                      setTopic("")
                      setTags("")
                      setSelectedFile(null)
                      setUploadStatus("idle")
                    }}
                    className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    disabled={uploadStatus === "uploading"}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#942D4B] transition-colors shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={uploadStatus === "uploading" || !selectedFile}
                  >
                    {uploadStatus === "uploading" ? "Uploading..." : "Upload Note"}
                  </button>
                </div>
              </form>
            </section>

            {/* Recent Uploads Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-200">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Uploaded Notes</h3>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Search */}
                  <div className="relative w-full sm:w-48">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Search notes..."
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter by Subject */}
                  <select
                    className="px-3 py-2 text-sm rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                  >
                    <option value="">All Subjects</option>
                    {availableSubjects.map((subj) => (
                      <option key={subj} value={subj}>
                        {subj.charAt(0).toUpperCase() + subj.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>

                  {/* Filter by Class */}
                  <select
                    className="px-3 py-2 text-sm rounded-lg border-gray-200 bg-gray-50 text-gray-900 focus:ring-primary focus:border-primary transition-colors"
                    value={filterClass}
                    onChange={(e) => setFilterClass(e.target.value)}
                  >
                    <option value="">All Classes</option>
                    {availableClassGrades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade.charAt(0).toUpperCase() + grade.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes Table */}
              {isLoadingNotes ? (
                <div className="p-12 text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                  <p className="text-gray-500 mt-4">Loading notes...</p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No notes found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchQuery || filterSubject || filterClass
                      ? "Try adjusting your filters"
                      : "Upload your first note to get started"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                        <th className="py-4 px-6 font-semibold">File Name</th>
                        <th className="py-4 px-6 font-semibold">Subject & Class</th>
                        <th className="py-4 px-6 font-semibold">Term & Week</th>
                        <th className="py-4 px-6 font-semibold">Date Uploaded</th>
                        <th className="py-4 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredNotes.map((note) => (
                        <tr key={note.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-600">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{note.title}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(note.fileSize)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900 capitalize">
                                {note.subject.replace("-", " ")}
                              </p>
                              <p className="text-xs text-gray-500 capitalize">
                                {note.classGrade.replace("-", " ")}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="font-medium text-gray-900 capitalize">
                                {note.term.replace("-", " ")}
                              </p>
                              {note.week && (
                                <p className="text-xs text-gray-500">Week {note.week}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm">
                              <p className="text-gray-900">{formatDate(note.createdAt)}</p>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleDownload(note)}
                                className="p-1.5 text-primary hover:bg-primary/10 rounded-md transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(note.id, note.title)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
