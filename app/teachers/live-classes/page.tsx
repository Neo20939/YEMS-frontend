"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import TeacherSidebar from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"
import { cn } from "@/lib/utils"

interface LiveClass {
  id: string
  title: string
  subject: string
  className: string
  scheduledTime: string
  duration: number
  status: 'scheduled' | 'live' | 'ended'
  studentsJoined: number
  totalStudents: number
  meetingLink?: string
  description?: string
}

interface CreateClassFormData {
  title: string
  subject: string
  className: string
  date: string
  time: string
  duration: number
  description: string
  meetingLink: string
}

const SUBJECT_OPTIONS = [
  { value: 'mathematics', label: 'Mathematics', color: 'bg-blue-100 text-blue-600', icon: 'calculate' },
  { value: 'english', label: 'English', color: 'bg-rose-100 text-rose-600', icon: 'menu_book' },
  { value: 'science', label: 'Science', color: 'bg-emerald-100 text-emerald-600', icon: 'science' },
  { value: 'history', label: 'History', color: 'bg-amber-100 text-amber-600', icon: 'history_edu' },
  { value: 'computer', label: 'Computer Studies', color: 'bg-violet-100 text-violet-600', icon: 'computer' },
  { value: 'physics', label: 'Physics', color: 'bg-cyan-100 text-cyan-600', icon: 'physics' },
  { value: 'chemistry', label: 'Chemistry', color: 'bg-orange-100 text-orange-600', icon: 'biotech' },
  { value: 'biology', label: 'Biology', color: 'bg-teal-100 text-teal-600', icon: 'ecology' },
]

const CLASS_OPTIONS = [
  'Form 1 North', 'Form 1 South', 'Form 2 East', 'Form 2 West',
  'Form 3 North', 'Form 3 South', 'Form 4 East', 'Form 4 West',
]

export default function LiveClassesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = React.useState<'schedule' | 'create'>('schedule')
  const [liveClasses, setLiveClasses] = React.useState<LiveClass[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [isCreating, setIsCreating] = React.useState(false)
  
  // Form state
  const [formData, setFormData] = React.useState<CreateClassFormData>({
    title: '',
    subject: 'mathematics',
    className: 'Form 1 North',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    description: '',
    meetingLink: '',
  })

  React.useEffect(() => {
    loadLiveClasses()
  }, [])

  async function loadLiveClasses() {
    setIsLoading(true)
    try {
      // Try to fetch from backend
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/teachers/live-classes', {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setLiveClasses(Array.isArray(data) ? data : [])
      } else {
        // Use fallback data
        setLiveClasses(getFallbackClasses())
      }
    } catch (error) {
      console.error('Failed to load live classes:', error)
      setLiveClasses(getFallbackClasses())
    } finally {
      setIsLoading(false)
    }
  }

  function getFallbackClasses(): LiveClass[] {
    const now = new Date()
    return [
      {
        id: 'class-1',
        title: 'Advanced Calculus - Integration Methods',
        subject: 'mathematics',
        className: 'Form 4 North',
        scheduledTime: new Date(now.setHours(10, 0)).toISOString(),
        duration: 90,
        status: 'live',
        studentsJoined: 28,
        totalStudents: 35,
        description: 'Covering integration by parts and substitution methods',
        meetingLink: 'https://zoom.us/j/1234567890',
      },
      {
        id: 'class-2',
        title: 'Organic Chemistry - Hydrocarbons',
        subject: 'chemistry',
        className: 'Form 3 East',
        scheduledTime: new Date(now.setHours(14, 0)).toISOString(),
        duration: 60,
        status: 'scheduled',
        studentsJoined: 0,
        totalStudents: 30,
        description: 'Introduction to alkanes, alkenes, and alkynes',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
      },
      {
        id: 'class-3',
        title: 'Shakespeare - Hamlet Analysis',
        subject: 'english',
        className: 'Form 4 South',
        scheduledTime: new Date(now.setHours(8, 0)).toISOString(),
        duration: 60,
        status: 'ended',
        studentsJoined: 32,
        totalStudents: 32,
        description: 'Character analysis and themes in Hamlet',
      },
    ]
  }

  function handleInputChange(field: keyof CreateClassFormData, value: any) {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault()
    setIsCreating(true)
    
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/teachers/live-classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...formData,
          scheduledTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        }),
      })

      if (response.ok) {
        // Success - reload classes
        await loadLiveClasses()
        setShowCreateModal(false)
        setFormData({
          title: '',
          subject: 'mathematics',
          className: 'Form 1 North',
          date: new Date().toISOString().split('T')[0],
          time: '10:00',
          duration: 60,
          description: '',
          meetingLink: '',
        })
      } else {
        // Fallback - add to local state
        const newClass: LiveClass = {
          id: `class-${Date.now()}`,
          title: formData.title,
          subject: formData.subject,
          className: formData.className,
          scheduledTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
          duration: formData.duration,
          status: 'scheduled',
          studentsJoined: 0,
          totalStudents: 0,
          description: formData.description,
          meetingLink: formData.meetingLink,
        }
        setLiveClasses(prev => [...prev, newClass])
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error('Failed to create class:', error)
      // Still add locally for demo
      const newClass: LiveClass = {
        id: `class-${Date.now()}`,
        title: formData.title,
        subject: formData.subject,
        className: formData.className,
        scheduledTime: new Date(`${formData.date}T${formData.time}`).toISOString(),
        duration: formData.duration,
        status: 'scheduled',
        studentsJoined: 0,
        totalStudents: 0,
        description: formData.description,
        meetingLink: formData.meetingLink,
      }
      setLiveClasses(prev => [...prev, newClass])
      setShowCreateModal(false)
    } finally {
      setIsCreating(false)
    }
  }

  function handleStartClass(classId: string) {
    // In production, this would open the video conferencing interface
    alert(`Starting live class... (Video integration would open here)`)
  }

  function handleJoinClass(classId: string) {
    alert(`Joining live class... (Video integration would open here)`)
  }

  function handleDeleteClass(classId: string) {
    if (confirm('Are you sure you want to delete this scheduled class?')) {
      setLiveClasses(prev => prev.filter(c => c.id !== classId))
    }
  }

  function formatTime(isoString: string) {
    const date = new Date(isoString)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatDate(isoString: string) {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  function getStatusBadge(status: LiveClass['status']) {
    const styles = {
      live: 'bg-rose-100 text-rose-700 border-rose-200',
      scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
      ended: 'bg-slate-100 text-slate-600 border-slate-200',
    }
    
    const icons = {
      live: 'radio_button_checked',
      scheduled: 'schedule',
      ended: 'check_circle',
    }
    
    return (
      <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border", styles[status])}>
        <span className="material-symbols-outlined text-xs">{icons[status]}</span>
        {status === 'live' && <span className="size-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  function getSubjectInfo(subject: string) {
    return SUBJECT_OPTIONS.find(s => s.value === subject) || SUBJECT_OPTIONS[0]
  }

  const liveClassesCount = liveClasses.filter(c => c.status === 'live').length
  const scheduledClassesCount = liveClasses.filter(c => c.status === 'scheduled').length

  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />

        <main className="py-8 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Classes</h1>
                <p className="text-slate-500">Schedule and manage your virtual classrooms</p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
              >
                <span className="material-symbols-outlined">video_call</span>
                Schedule New Class
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
                    <span className="material-symbols-outlined text-xl">live_tv</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Live Now</p>
                    <p className="text-2xl font-bold text-slate-900">{liveClassesCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Scheduled Today</p>
                    <p className="text-2xl font-bold text-slate-900">{scheduledClassesCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <span className="material-symbols-outlined text-xl">groups</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Total Students</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {liveClasses.reduce((acc, c) => acc + c.studentsJoined, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 mb-6 overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={cn(
                    "flex-1 py-4 px-6 font-semibold text-sm transition-colors border-b-2",
                    activeTab === 'schedule'
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  <span className="material-symbols-outlined align-middle mr-2">list_alt</span>
                  All Classes
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={cn(
                    "flex-1 py-4 px-6 font-semibold text-sm transition-colors border-b-2",
                    activeTab === 'create'
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  )}
                >
                  <span className="material-symbols-outlined align-middle mr-2">video_call</span>
                  Quick Schedule
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'schedule' && (
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading classes...</p>
                      </div>
                    ) : liveClasses.length === 0 ? (
                      <div className="text-center py-12">
                        <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">video_call</span>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">No Classes Scheduled</h3>
                        <p className="text-slate-500 mb-6">Start by scheduling your first live class</p>
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                        >
                          <span className="material-symbols-outlined">add</span>
                          Schedule Class
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {liveClasses.map((classItem) => {
                          return (
                            <div
                              key={classItem.id}
                              className="p-5 rounded-xl border border-slate-200 hover:border-primary/50 transition-all bg-slate-50/50"
                            >
                              <div className="flex items-center gap-4">
                                {/* Class Info */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-slate-900 truncate">{classItem.title}</h3>
                                    {getStatusBadge(classItem.status)}
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <span className="flex items-center gap-1">
                                      <span className="material-symbols-outlined text-sm">class</span>
                                      {classItem.className}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span className="material-symbols-outlined text-sm">schedule</span>
                                      {formatDate(classItem.scheduledTime)} at {formatTime(classItem.scheduledTime)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <span className="material-symbols-outlined text-sm">timer</span>
                                      {classItem.duration} min
                                    </span>
                                  </div>
                                  {classItem.description && (
                                    <p className="text-sm text-slate-600 mt-2 truncate">{classItem.description}</p>
                                  )}
                                </div>

                                {/* Students Count */}
                                <div className="text-center px-4">
                                  <p className="text-2xl font-bold text-slate-900">{classItem.studentsJoined}</p>
                                  <p className="text-xs text-slate-500">/ {classItem.totalStudents} students</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                  {classItem.status === 'live' && (
                                    <button
                                      onClick={() => handleStartClass(classItem.id)}
                                      className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
                                    >
                                      <span className="material-symbols-outlined">videocam</span>
                                      Go Live
                                    </button>
                                  )}
                                  {classItem.status === 'scheduled' && (
                                    <button
                                      onClick={() => handleJoinClass(classItem.id)}
                                      className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                                    >
                                      <span className="material-symbols-outlined">play_arrow</span>
                                      Start
                                    </button>
                                  )}
                                  {classItem.status === 'ended' && (
                                    <button
                                      disabled
                                      className="flex items-center gap-2 px-4 py-2.5 bg-slate-200 text-slate-500 font-semibold rounded-xl cursor-not-allowed"
                                    >
                                      <span className="material-symbols-outlined">check</span>
                                      Ended
                                    </button>
                                  )}
                                  {classItem.status === 'scheduled' && (
                                    <button
                                      onClick={() => handleDeleteClass(classItem.id)}
                                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                      title="Delete class"
                                    >
                                      <span className="material-symbols-outlined">delete</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'create' && (
                  <form onSubmit={handleCreateClass} className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Class Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Introduction to Calculus"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Subject *
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          {SUBJECT_OPTIONS.map((subject) => (
                            <option key={subject.value} value={subject.value}>
                              {subject.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Class *
                        </label>
                        <select
                          value={formData.className}
                          onChange={(e) => handleInputChange('className', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        >
                          {CLASS_OPTIONS.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Time *
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        min="15"
                        max="180"
                        step="15"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Meeting Link
                      </label>
                      <input
                        type="url"
                        value={formData.meetingLink}
                        onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                        placeholder="e.g., https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                      <p className="mt-1.5 text-xs text-slate-500">
                        Optional: Add a Zoom, Google Meet, or other video conferencing link
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Brief description of what will be covered in this class..."
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setFormData({
                          title: '',
                          subject: 'mathematics',
                          className: 'Form 1 North',
                          date: new Date().toISOString().split('T')[0],
                          time: '10:00',
                          duration: 60,
                          description: '',
                        })}
                        className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isCreating ? (
                          <>
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                            Scheduling...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined">check_circle</span>
                            Schedule Class
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Modal (alternative to tab) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Schedule New Live Class</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <span className="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Class Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Introduction to Calculus"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {SUBJECT_OPTIONS.map((subject) => (
                      <option key={subject.value} value={subject.value}>{subject.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Class *</label>
                  <select
                    value={formData.className}
                    onChange={(e) => handleInputChange('className', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    {CLASS_OPTIONS.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  min="15"
                  max="180"
                  step="15"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Meeting Link</label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                  placeholder="e.g., https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Optional: Add a Zoom, Google Meet, or other video conferencing link
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="What will be covered in this class?"
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">video_call</span>
                      Schedule Class
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
