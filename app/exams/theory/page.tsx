"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import { ExamListing } from "@/components/exam"
import type { ExamCard } from "@/components/exam"

export default function TheoryExamsPage() {
  const router = useRouter()

  const exams: ExamCard[] = [
    {
      id: "physics-theory",
      title: "Physics Theory",
      description: "Comprehensive theory questions on mechanics and electromagnetism.",
      duration: 120,
      questions: 8,
      questionType: "Theory",
      status: "not-started",
      iconType: "science",
      route: "/theory-exam",
    },
    {
      id: "chemistry-theory",
      title: "Chemistry Theory",
      description: "Organic and inorganic chemistry detailed responses.",
      duration: 90,
      questions: 6,
      questionType: "Theory",
      status: "new",
      iconType: "science",
      route: "/theory-exam",
    },
    {
      id: "biology-theory",
      title: "Biology Theory",
      description: "Cell biology, genetics, and ecosystem analysis.",
      duration: 100,
      questions: 7,
      questionType: "Theory",
      status: "not-started",
      iconType: "science",
      route: "/theory-exam",
    },
    {
      id: "english-essay",
      title: "English Essay Writing",
      description: "Critical analysis and descriptive writing assessment.",
      duration: 150,
      questions: 4,
      questionType: "Theory",
      status: "upcoming",
      iconType: "english",
      route: "#",
    },
    {
      id: "history-essay",
      title: "History Essay",
      description: "Historical events analysis and interpretation.",
      duration: 120,
      questions: 5,
      questionType: "Theory",
      status: "not-started",
      iconType: "history",
      route: "/theory-exam",
    },
    {
      id: "philosophy-essay",
      title: "Philosophy Essay",
      description: "Ethical reasoning and philosophical argumentation.",
      duration: 180,
      questions: 4,
      questionType: "Theory",
      status: "not-started",
      iconType: "philosophy",
      route: "/theory-exam",
    },
  ]

  const handleStartExam = (exam: ExamCard) => {
    router.push(exam.route)
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <main className="py-8">
          <ExamListing
            title="Theory Examinations"
            exams={exams}
            onStartExam={handleStartExam}
          />
        </main>
      </div>
    </div>
  )
}
