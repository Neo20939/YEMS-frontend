"use client"

interface TeacherHeroProps {
  teacherName?: string
  academicSession?: string
}

export default function TeacherHero({
  teacherName = "Teacher",
  academicSession = "2024/2025",
}: TeacherHeroProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <header className="bg-primary w-full py-20 px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-900/10 rounded-full -ml-20 -mb-20 blur-2xl"></div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/30 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-rose-400/30">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          Academic Session {academicSession}
        </div>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
          {getGreeting()}, {teacherName}
        </h1>

        <p className="text-rose-100 text-lg font-light opacity-90">
          Manage notes, assignments, and examinations for your students.
        </p>
      </div>
    </header>
  )
}
