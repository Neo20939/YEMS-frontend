"use client"

import { Calendar, Clock, Users, ArrowRight } from "lucide-react"

interface TeacherMeetingsPanelProps {
  meetingsCount?: number
  periodsCount?: number
}

export default function TeacherMeetingsPanel({
  meetingsCount = 0,
  periodsCount = 0,
}: TeacherMeetingsPanelProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Date/Time Card */}
      <div className="bg-primary rounded-3xl p-8 relative overflow-hidden shadow-soft">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="w-5 h-5 text-rose-200" />
            <span className="text-xs font-medium text-rose-200">{today}</span>
          </div>

          <div className="text-center py-6">
            <p className="text-rose-100 text-sm font-medium mb-2">{today}</p>
            <h3 className="text-5xl font-bold text-white tracking-tight">{currentTime}</h3>
          </div>
        </div>
      </div>

      {/* Scheduled Meetings */}
      <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-slate-900">Scheduled Meetings Today</h4>
            <p className="text-xs text-slate-500">{meetingsCount} Meeting{meetingsCount !== 1 ? "s" : ""} Today</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
        </div>

        {meetingsCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 font-medium">No meetings scheduled</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Meeting items would be mapped here */}
          </div>
        )}

        <button className="w-full mt-4 text-xs font-bold text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center justify-center gap-1">
          Schedule Meeting
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Class Periods */}
      <div className="bg-white p-6 rounded-3xl shadow-soft border border-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900">Class Periods Today</h4>
            <p className="text-xs text-slate-500">{periodsCount} Period{periodsCount !== 1 ? "s" : ""} Today</p>
          </div>
          <button className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
            <Clock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
