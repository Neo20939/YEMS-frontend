"use client"

import { RefreshCw, Newspaper } from "lucide-react"

interface SchoolNewsProps {
  title?: string
  subtitle?: string
  hasNews?: boolean
}

export default function SchoolNews({
  title = "School News",
  subtitle = "Latest updates from the administration",
  hasNews = false,
}: SchoolNewsProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <p className="text-slate-500 mt-1">{subtitle}</p>
        </div>
        <button className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
          <RefreshCw className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-100 border-dashed flex-grow flex flex-col justify-center items-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
          <Newspaper className="w-8 h-8 text-slate-400" />
        </div>
        <h4 className="text-lg font-semibold text-slate-700 mb-2">All Caught Up!</h4>
        <p className="text-slate-500 max-w-sm mx-auto">
          {hasNews
            ? "Check back later for new announcements."
            : "There are no new announcements at this time. Check back later for updates."}
        </p>
      </div>
    </div>
  )
}
