"use client"

import { Calendar, ChevronRight } from "lucide-react"

interface Deadline {
  id: string
  title: string
  dueDate: string
  daysLeft: number
  color: string
}

interface DeadlinesPanelProps {
  title?: string
  deadlines?: Deadline[]
}

const defaultDeadlines: Deadline[] = [
  {
    id: "1",
    title: "Mathematics Quiz",
    dueDate: "Due in 2 days",
    daysLeft: 2,
    color: "bg-rose-500",
  },
  {
    id: "2",
    title: "History Essay",
    dueDate: "Due in 5 days",
    daysLeft: 5,
    color: "bg-blue-500",
  },
  {
    id: "3",
    title: "Physics Lab",
    dueDate: "Due in 8 days",
    daysLeft: 8,
    color: "bg-amber-500",
  },
]

export default function DeadlinesPanel({
  title = "Next Deadlines",
  deadlines = defaultDeadlines,
}: DeadlinesPanelProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-slate-900 text-white rounded-3xl p-8 relative overflow-hidden h-full flex flex-col transform perspective-1000 rotate-y-2 shadow-2xl shadow-slate-900/50 hover:rotate-y-1 transition-transform duration-300 ease-out" style={{
        transform: 'perspective(1000px) rotateY(-4deg) translateX(-10px)',
        boxShadow: '15px 15px 30px rgba(0, 0, 0, 0.3), 5px 5px 15px rgba(0, 0, 0, 0.2)'
      }}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-rose-600/20 rounded-full -mr-10 -mt-10 blur-3xl"></div>

        <h3 className="text-lg font-bold mb-6 flex items-center gap-3 relative z-10">
          <span className="p-2 bg-white/10 rounded-lg">
            <Calendar className="w-4 h-4 text-rose-400" />
          </span>
          {title}
        </h3>

        <div className="space-y-4 relative z-10 flex-grow">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className={`w-1.5 h-10 ${deadline.color} rounded-full`}></div>
                <div>
                  <p className="font-semibold text-sm">{deadline.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{deadline.dueDate}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-center relative z-10">
          <a className="text-xs font-semibold text-rose-300 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
            View Calendar
          </a>
        </div>
      </div>
    </div>
  )
}
