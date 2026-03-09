"use client"

import { useUser } from "@/contexts/UserContext"

function getGreeting(name: string): string {
  const hour = new Date().getHours()
  if (hour < 12) return `Good morning, ${name}`
  if (hour < 18) return `Good afternoon, ${name}`
  return `Good evening, ${name}`
}

export default function AdminHeader() {
  const { user } = useUser()
  const displayName = user?.name || "Admin"
  const greeting = getGreeting(displayName.split(" ")[0])
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <header className="h-16 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Greeting */}
      <div className="flex items-center gap-4 flex-1">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{greeting}</h1>
          <p className="text-xs text-slate-500">Here's what's happening today</p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full relative transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-stone-900"></span>
        </button>
        <div className="h-8 w-px bg-stone-200 dark:border-stone-800 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
            {initial}
          </div>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 hidden sm:block">
            {displayName}
          </span>
        </div>
      </div>
    </header>
  )
}
