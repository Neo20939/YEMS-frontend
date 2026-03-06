"use client"

import { Bell, LogOut, User, Settings } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface TeacherHeaderProps {
  teacherName?: string
  teacherId?: string
}

export default function TeacherHeader({
  teacherName = "Teacher",
  teacherId = "T001",
}: TeacherHeaderProps) {
  const initial = teacherName.charAt(0).toUpperCase()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    console.log("Logging out...")
    setIsDropdownOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-100 py-6 px-6">
      <div className="max-w-7xl mx-auto relative flex items-center justify-center">
        <div className="absolute left-0 hidden md:flex items-center gap-4">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Teacher Dashboard
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
            <p className="text-sm font-semibold text-slate-800">{teacherName}</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">
              ID: {teacherId}
            </p>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              {initial}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-slate-800">{teacherName}</p>
                  <p className="text-xs text-slate-500">ID: {teacherId}</p>
                </div>
                <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
