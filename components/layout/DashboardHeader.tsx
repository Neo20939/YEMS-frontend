"use client"

import { Bell } from "lucide-react"

interface DashboardHeaderProps {
  studentName?: string
  studentId?: string
}

export default function DashboardHeader({
  studentName = "User",
  studentId = "4022",
}: DashboardHeaderProps) {
  const initial = studentName.charAt(0).toUpperCase()

  return (
    <nav className="bg-white border-b border-gray-100 py-6 px-6">
      <div className="max-w-7xl mx-auto relative flex items-center justify-center">
        <div className="absolute left-0 hidden md:flex items-center gap-4">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Student Dashboard
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Yeshua Educational Platform
          </span>
        </div>

        <div className="absolute right-0 flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <div className="hidden md:flex flex-col items-end mr-2">
            <p className="text-sm font-semibold text-slate-800">{studentName}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              ID: {studentId}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold border border-slate-200">
            {initial}
          </div>
        </div>
      </div>
    </nav>
  )
}
