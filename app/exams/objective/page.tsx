"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import { ExamListing } from "@/components/exam"
import type { ExamCard } from "@/components/exam"

export default function ObjectiveExamsPage() {
  const router = useRouter()

  const exams: ExamCard[] = [
    {
      id: "math-101",
      title: "Mathematics 101",
      description: "Algebra, Calculus & Geometry fundamentals.",
      duration: 60,
      questions: 40,
      questionType: "MCQs",
      status: "not-started",
      iconType: "math",
      route: "/objective-exam",
    },
    {
      id: "physics-201",
      title: "Advanced Physics",
      description: "Quantum mechanics and Thermodynamics.",
      duration: 90,
      questions: 50,
      questionType: "MCQs",
      status: "upcoming",
      iconType: "science",
      route: "#",
    },
    {
      id: "english-lit",
      title: "English Lit.",
      description: "Analysis of 19th-century classic literature.",
      duration: 45,
      questions: 30,
      questionType: "MCQs",
      status: "new",
      iconType: "english",
      route: "/objective-exam",
    },
    {
      id: "philosophy-101",
      title: "Philosophy 101",
      description: "Introduction to logic and ethical frameworks.",
      duration: 60,
      questions: 40,
      questionType: "MCQs",
      status: "not-started",
      iconType: "philosophy",
      route: "/objective-exam",
    },
    {
      id: "world-history",
      title: "World History",
      description: "Significant events of the 20th century.",
      duration: 50,
      questions: 35,
      questionType: "MCQs",
      status: "not-started",
      iconType: "history",
      route: "/objective-exam",
    },
    {
      id: "computer-science",
      title: "Computer Science",
      description: "Introduction to algorithms and data structures.",
      duration: 75,
      questions: 45,
      questionType: "MCQs",
      status: "not-started",
      iconType: "computer",
      route: "/objective-exam",
    },
  ]

  const handleStartExam = (exam: ExamCard) => {
    router.push(exam.route)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <main className="py-8">
          <ExamListing
            title="Multiple Choice Exams"
            exams={exams}
            onStartExam={handleStartExam}
          />
        </main>
      </div>
    </div>
  )
}
