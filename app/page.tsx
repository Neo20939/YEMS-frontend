import Link from "next/link"
import { GraduationCap, BookOpen, FileText, Video, ClipboardList, StickyNote } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-8">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Education Platform
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Modular exam components and student dashboard built with Next.js, shadcn/ui and Lucide Icons
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard"
            className="group block p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">
                Dashboard
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Student dashboard with exams, classes, notes, and reports
            </p>
          </Link>

          <Link
            href="/live-lessons"
            className="group block p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Video className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">
                Live Lessons
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Interactive live sessions with expert instructors
            </p>
          </Link>

          <Link
            href="/objective-exam"
            className="group block p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">
                Objective Exam
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              MCQ interface with question palette, timer, and navigation
            </p>
          </Link>

          <Link
            href="/theory-exam"
            className="group block p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">
                Theory Exam
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Text editor interface for descriptive answers with section navigation
            </p>
          </Link>

          <Link
            href="/assignments"
            className="group block p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">
                Assignments
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              View and submit assignments with deadlines
            </p>
          </Link>

          <Link
            href="/notes"
            className="group block p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary dark:hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <StickyNote className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary">
                Notes
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Access study notes and materials
            </p>
          </Link>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
            📦 Components Included
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-slate-600 dark:text-slate-400">
            <li>• DashboardHeader</li>
            <li>• DashboardHero</li>
            <li>• DashboardCards</li>
            <li>• LiveLessons</li>
            <li>• ExamHeader</li>
            <li>• QuestionCard</li>
            <li>• QuestionPalette</li>
            <li>• QuestionNavigation</li>
            <li>• TextEditor</li>
            <li>• TheorySidebar</li>
            <li>• StickyActionBar</li>
            <li>• Sidebar</li>
            <li>• SchoolNews</li>
            <li>• DeadlinesPanel</li>
            <li>• Button (shadcn)</li>
          </div>
        </div>
      </div>
    </div>
  )
}
