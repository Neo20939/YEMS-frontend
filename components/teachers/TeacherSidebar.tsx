"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  GraduationCap,
  BookOpen,
  CheckSquare,
  Settings,
  ClipboardCheck,
  Radio,
  ClipboardList,
} from "lucide-react"
import { useUser } from "@/contexts/UserContext"

interface TeacherSidebarProps {
  teacherName?: string
  teacherId?: string
}

const navItems = [
  { name: "Manage Notes", href: "/teachers/notes/upload", icon: BookOpen },
  { name: "Assignments", href: "/teachers/assignments", icon: CheckSquare },
  { name: "Live Classes", href: "/teachers/live-classes", icon: Radio },
  { name: "Create Exam", href: "/teachers/exams/create", icon: ClipboardCheck },
  { name: "Add Questions", href: "/teachers/exams/setup", icon: Settings },
  { name: "Student Results", href: "/teachers/results", icon: ClipboardList },
]

export default function TeacherSidebar({
  teacherName: propName,
  teacherId: propId,
}: TeacherSidebarProps) {
  const { user } = useUser()
  const teacherName = user?.name || propName || "Teacher"
  const teacherId = user?.id || propId || "T001"
  const pathname = usePathname()

  return (
    <aside className="group fixed left-0 top-0 h-full bg-primary z-50 flex flex-col transition-all duration-300 w-20 hover:w-64 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="h-24 flex items-center justify-center border-b border-white/10 w-full shrink-0">
        <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0 p-2">
          <img src="/yhs.png" alt="Yeshua High School" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-colors relative ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
        <Link
          href="#"
          className="flex items-center gap-4 px-3 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span className="whitespace-nowrap font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            Settings
          </span>
        </Link>
        <div className="flex items-center gap-4 px-3 py-3 rounded-xl bg-rose-800/50 mt-auto">
          <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {teacherName.charAt(0).toUpperCase()}
          </div>
          <div className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75 overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {teacherName}
            </p>
            <p className="text-[10px] text-white/60 uppercase">ID: {teacherId}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
