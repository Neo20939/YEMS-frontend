"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/UserContext"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: "dashboard" },
  { name: "User Management", href: "/admin/users", icon: "group" },
  { name: "Teachers", href: "/admin/teachers", icon: "person" },
  { name: "Students", href: "/admin/students", icon: "school" },
  { name: "Subjects", href: "/admin/subjects", icon: "menu_book" },
  { name: "Classes", href: "/admin/classes/manage", icon: "class" },
  { name: "Roles & Permissions", href: "/admin/roles", icon: "shield_person" },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: "history_edu" },
  { name: "System Settings", href: "/admin/settings", icon: "settings" },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const displayName = user?.name || "Admin"
  const displayEmail = user?.email || "admin@yesua.edu"
  const displayRole = user?.role || "Admin"

  return (
    <aside className="w-20 lg:w-64 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col fixed h-full z-50">
      {/* Logo */}
      <div className="p-6 flex flex-col items-center gap-2">
        <div className="w-16 h-16 flex items-center justify-center shrink-0">
          <img src="/yhs.png" alt="Yeshua High School" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-primary font-bold text-lg leading-tight hidden lg:block text-center">Yeshua High School</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 lg:px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="hidden lg:block text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
          </div>
          <div className="overflow-hidden hidden lg:block">
            <p className="text-sm font-bold truncate text-slate-900 dark:text-slate-100">{displayName}</p>
            <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
