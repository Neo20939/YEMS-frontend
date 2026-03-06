"use client"

import Link from "next/link"
import {
  BookOpen,
  CheckSquare,
  FileText,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react"

interface TeacherActionCard {
  title: string
  description: string
  actionText: string
  icon: React.ReactNode
  href: string
}

const cards: TeacherActionCard[] = [
  {
    title: "Notes",
    description: "Upload and manage class notes",
    actionText: "Manage Notes",
    icon: <BookOpen className="w-10 h-10" />,
    href: "/teachers/notes",
  },
  {
    title: "Assignments",
    description: "Create and grade assignments",
    actionText: "Manage",
    icon: <CheckSquare className="w-10 h-10" />,
    href: "/teachers/assignments",
  },
  {
    title: "Mid Term Test",
    description: "Set and schedule mid term tests",
    actionText: "Set Test",
    icon: <FileText className="w-10 h-10" />,
    href: "/teachers/exams/midterm",
  },
  {
    title: "Examination",
    description: "Create and manage examinations",
    actionText: "Set Exam",
    icon: <ClipboardCheck className="w-10 h-10" />,
    href: "/teachers/exams",
  },
]

export default function TeacherActionCards() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 justify-items-center">
        {cards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-xl cursor-pointer group flex flex-col items-center text-center h-full border border-slate-50 transition-shadow duration-300 w-full max-w-[280px]"
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
        ))}
      </div>
    </div>
  )
}
