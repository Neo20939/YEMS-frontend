"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { StudentSidebar } from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { ExamSelection } from "@/components/exam"
import type { ExamTypeCard } from "@/components/exam"

export default function ExamsPage() {
  const router = useRouter()

  const handleExamTypeSelect = (examType: ExamTypeCard) => {
    router.push(examType.route)
  }

  const examTypes: ExamTypeCard[] = [
    {
      type: "objective",
      title: "Multiple Choice Exam",
      description:
        "A standardized assessment format consisting of questions with predefined options. Best for testing factual knowledge and quick recall.",
      route: "/exams/objective",
      available: true,
    },
    {
      type: "theory",
      title: "Theory Examination",
      description:
        "Comprehensive assessment requiring detailed written responses. Evaluate your critical thinking, analysis, and descriptive abilities.",
      route: "/exams/theory",
      available: true,
    },
  ]

  return (
    <div className="min-h-screen bg-cream">
      <StudentSidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <main className="py-8">
          <ExamSelection
            examTypes={examTypes}
            onExamTypeSelect={handleExamTypeSelect}
          />
        </main>
      </div>
    </div>
  )
}
