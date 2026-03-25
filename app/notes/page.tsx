"use client"

import React, { useState, useEffect } from "react"
import { StudentSidebar as Sidebar } from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { NotesDashboard } from "@/components/NotesDashboard"
import { getNotes, triggerFileDownload } from "@/lib/api/notes-client"
import type { Note } from "@/lib/api/types"
import { useToast, ToastContainer } from "@/components/ui"

export default function NotesPage() {
  const { toasts, toast, removeToast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTerm, setSelectedTerm] = useState("second-term")

  useEffect(() => {
    loadNotes()
  }, [selectedTerm])

  const loadNotes = async () => {
    setIsLoading(true)
    const result = await getNotes({
      term: selectedTerm as any,
      search: searchQuery || undefined,
    })

    if (result.success && result.data) {
      setNotes(result.data.notes)
    } else {
      toast.error("Failed to load notes")
      setNotes([])
    }
    setIsLoading(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Debounced search could be implemented here
  }

  const handleTermChange = (term: string) => {
    const termMap: Record<string, string> = {
      "Second Term": "second-term",
      "First Term": "first-term",
      "Third Term": "third-term",
    }
    setSelectedTerm(termMap[term] || "second-term")
  }

  const handleNoteDownload = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    const result = await triggerFileDownload(noteId, note.fileName)
    if (result.success) {
      toast.success("Download started")
    } else {
      toast.error(result.error || "Failed to download note")
    }
  }

  const handleViewOtherSubjects = () => {
    // Could navigate to a subjects page or filter
    toast.info("Feature coming soon")
  }

  // Transform API notes to component format
  const transformedNotes = notes.map((note) => ({
    id: note.id,
    subject: formatSubjectName(note.subject),
    week: note.week || "01",
    title: note.title,
    description: note.description || note.topic || "",
    term: formatTermName(note.term),
    date: formatDate(note.createdAt),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <NotesDashboard
          notes={isLoading ? undefined : transformedNotes}
          onNoteDownload={handleNoteDownload}
          onSearch={handleSearch}
          onTermChange={handleTermChange}
          onViewOtherSubjects={handleViewOtherSubjects}
          isLoading={isLoading}
        />
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  )
}

function formatSubjectName(subject: string): string {
  return subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " ")
}

function formatTermName(term: string): string {
  return term.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  })
}
