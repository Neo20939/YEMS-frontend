"use client"

import {
  AlertCircle,
  Radio,
  BookOpen,
  CheckSquare,
  FileText,
  ArrowRight
} from "lucide-react"
import Image from "next/image"

interface DashboardCard {
  title: string
  description: string
  actionText: string
  icon: React.ReactNode
  image?: string
  href?: string
}

const cards: DashboardCard[] = [
  {
    title: "Exams",
    description: "Check schedules & results",
    actionText: "Access Portal",
    icon: <AlertCircle className="w-10 h-10" />,
    image: "/objective_section_exam.png",
    href: "/objective-exam",
  },
  {
    title: "Live Classes",
    description: "Join your virtual classroom",
    actionText: "Join Now",
    icon: <Radio className="w-10 h-10" />,
  },
  {
    title: "Notes",
    description: "Read and download materials",
    actionText: "View Library",
    icon: <BookOpen className="w-10 h-10" />,
  },
  {
    title: "Assignments",
    description: "Submit your pending work",
    actionText: "0 Pending",
    icon: <CheckSquare className="w-10 h-10" />,
  },
  {
    title: "Mid-Term Exams",
    description: "View schedule & prepare",
    actionText: "Start Revision",
    icon: <FileText className="w-10 h-10" />,
    href: "/exams/midterm",
  },
]

export default function DashboardCards() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 -mt-16 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-3xl shadow-soft hover:shadow-xl  cursor-pointer group flex flex-col items-center text-center h-full border border-slate-50 overflow-hidden"
          >
            {card.image ? (
              <div className="w-full h-32 mb-6 relative rounded-2xl overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-rose-soft flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {card.icon}
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{card.description}</p>
            <span className="mt-auto text-xs font-bold text-primary uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4 flex items-center gap-1">
              {card.actionText}
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
