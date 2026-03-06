"use client"

import Link from "next/link"
import { useState } from "react"
import {
  AlertCircle,
  Radio,
  BookOpen,
  CheckSquare,
  FileText,
  ArrowRight,
  ClipboardCheck,
  ChevronDown
} from "lucide-react"

interface DashboardCard {
  title: string
  description: string
  actionText: string
  icon: React.ReactNode
  href?: string
  isExamCard?: boolean
}

const cards: DashboardCard[] = [
  {
    title: "My Examinations",
    description: "Check schedules & results",
    actionText: "Access Portal",
    icon: <ClipboardCheck className="w-10 h-10" />,
    href: "/exams",
    isExamCard: true,
  },
  {
    title: "Live Classes",
    description: "Join your virtual classroom",
    actionText: "Join Now",
    icon: <Radio className="w-10 h-10" />,
    href: "/live-lessons",
  },
  {
    title: "Notes",
    description: "Read and download materials",
    actionText: "View Library",
    icon: <BookOpen className="w-10 h-10" />,
    href: "/notes",
  },
  {
    title: "Assignments",
    description: "Submit your pending work",
    actionText: "0 Pending",
    icon: <CheckSquare className="w-10 h-10" />,
    href: "/assignments",
  },
]

const examTypes = [
  { id: "midterm", name: "Mid Term Test", href: "/exams/midterm" },
  { id: "examination", name: "Examination", href: "/exams" }
]

function ExamCard({ card }: { card: DashboardCard }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleExamSelect = (e: React.MouseEvent, examType: typeof examTypes[0]) => {
    e.stopPropagation()
    window.location.href = examType.href
  }

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-xl group flex flex-col items-center text-center h-full border border-slate-50 transition-shadow duration-300 relative">
      <div className="w-20 h-20 rounded-2xl bg-rose-soft flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
        {card.icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
      <p className="text-sm text-slate-500 mb-6">{card.description}</p>

      <div className="mt-auto w-full relative z-10">
        <button
          onClick={toggleDropdown}
          className="w-full text-xs font-bold text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4 flex items-center justify-center gap-1 mb-2 py-2"
        >
          Select Exam Type
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[100] overflow-hidden">
            {examTypes.map((examType) => (
              <button
                key={examType.id}
                onClick={(e) => handleExamSelect(e, examType)}
                className="w-full px-6 py-4 text-left hover:bg-rose-50 transition-colors border-b border-slate-100 last:border-b-0"
              >
                <span className="text-sm font-semibold text-slate-800 hover:text-primary">{examType.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardCards() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 justify-items-center">
        {cards.map((card, index) => (
          card.isExamCard ? (
            <ExamCard key={index} card={card} />
          ) : (
            <Link
              key={index}
              href={card.href || "#"}
              className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-xl cursor-pointer group flex flex-col items-center text-center h-full border border-slate-50 transition-shadow duration-300"
            >
              <div className="w-20 h-20 rounded-2xl bg-rose-soft flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{card.description}</p>
              <span className="mt-auto text-xs font-bold text-primary uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
                {card.actionText}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
            </Link>
          )
        ))}
      </div>
    </div>
  )
}
