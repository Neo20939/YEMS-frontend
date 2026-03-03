"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, Atom, BookOpen, FlaskConical, Globe, PenTool } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import { cn } from "@/lib/utils"

interface SubjectCard {
  id: string
  title: string
  description: string
  duration: number
  questions: number
  icon: React.ReactNode
  status: "not-started" | "upcoming" | "locked" | "new"
  route: string
}

export default function MidTermExamsPage() {
  const router = useRouter()

  const subjects: SubjectCard[] = [
    {
      id: "mathematics",
      title: "Mathematics 101",
      description: "Algebra, Calculus & Geometry fundamentals.",
      duration: 60,
      questions: 40,
      icon: <Calculator className="h-8 w-8" />,
      status: "not-started",
      route: "/objective-exam",
    },
    {
      id: "physics",
      title: "Advanced Physics",
      description: "Quantum mechanics and Thermodynamics.",
      duration: 90,
      questions: 50,
      icon: <Atom className="h-8 w-8" />,
      status: "upcoming",
      route: "/objective-exam",
    },
    {
      id: "english",
      title: "English Lit.",
      description: "Analysis of 19th-century classic literature.",
      duration: 45,
      questions: 30,
      icon: <BookOpen className="h-8 w-8" />,
      status: "new",
      route: "/objective-exam",
    },
    {
      id: "philosophy",
      title: "Philosophy 101",
      description: "Introduction to logic and ethical frameworks.",
      duration: 60,
      questions: 40,
      icon: <Globe className="h-8 w-8" />,
      status: "not-started",
      route: "/objective-exam",
    },
    {
      id: "history",
      title: "World History",
      description: "Significant events of the 20th century.",
      duration: 50,
      questions: 35,
      icon: <BookOpen className="h-8 w-8" />,
      status: "not-started",
      route: "/objective-exam",
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Atomic structure, bonding & reactions.",
      duration: 75,
      questions: 45,
      icon: <FlaskConical className="h-8 w-8" />,
      status: "not-started",
      route: "/objective-exam",
    },
  ]

  const handleStartExam = (subject: SubjectCard) => {
    if (subject.status !== "locked" && subject.status !== "upcoming") {
      router.push(subject.route)
    }
  }

  const getStatusBadge = (status: SubjectCard["status"]) => {
    const statusConfig = {
      "not-started": { label: "NOT STARTED", className: "bg-orange-100 text-orange-700" },
      "upcoming": { label: "UPCOMING", className: "bg-blue-100 text-blue-700" },
      "locked": { label: "LOCKED", className: "bg-slate-100 text-slate-500" },
      "new": { label: "NEW", className: "bg-green-100 text-green-700" },
    }
    const config = statusConfig[status]
    return (
      <span className={cn("text-xs font-semibold px-3 py-1 rounded-full", config.className)}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        
        <main className="p-6 lg:p-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide mb-4">
                ACADEMIC SESSION 2024/2025
              </span>
              <h1 className="text-4xl font-bold mb-3">Mid Term Examinations</h1>
              <p className="text-white/90 text-sm max-w-2xl mx-auto leading-relaxed">
                View and manage your scheduled assessments. Ensure you have a stable internet connection before starting any exam.
              </p>
            </div>
          </div>

          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-rose-600">📋</span>
              Available Assessments
            </h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                All Subjects
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                Upcoming
              </button>
            </div>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={cn(
                  "group relative bg-white rounded-2xl border border-slate-200 p-6 transition-all duration-300",
                  subject.status !== "locked" && subject.status !== "upcoming"
                    ? "hover:shadow-xl hover:border-rose-200 cursor-pointer hover:-translate-y-1"
                    : "opacity-60 cursor-not-allowed"
                )}
                onClick={() => handleStartExam(subject)}
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(subject.status)}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform duration-300">
                    {subject.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
                  {subject.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
                  {subject.description}
                </p>

                {/* Exam Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Duration: <strong>{subject.duration} mins</strong></span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Questions: <strong>{subject.questions} MCQs</strong></span>
                  </div>
                </div>

                {/* Action Button */}
                {subject.status === "locked" || subject.status === "upcoming" ? (
                  <button
                    disabled
                    className="w-full py-3 text-sm font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed"
                  >
                    Locked
                  </button>
                ) : (
                  <button className="w-full py-3 text-sm font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200">
                    Start Exam
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Support Text */}
          <div className="text-center mt-12">
            <p className="text-sm text-slate-500 flex items-center justify-center gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Having trouble? Contact our{" "}
              <button className="text-rose-600 hover:text-rose-700 font-medium underline underline-offset-2">
                technical support team
              </button>
              .
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
