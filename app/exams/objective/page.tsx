"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { StudentSidebar } from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { ExamListing } from "@/components/exam"
import type { ExamCard } from "@/components/exam"
import { getExams, convertExamToCard } from "@/lib/api/exam-client"
import { useUser } from "@/contexts/UserContext"

export default function ObjectiveExamsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [exams, setExams] = React.useState<ExamCard[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadExams() {
      setIsLoading(true)
      try {
        // Fetch objective exams from API
        const apiExams = await getExams('objective')
        
        // Convert API format to UI format
        const convertedExams = apiExams.map(convertExamToCard)
        setExams(convertedExams)
      } catch (error) {
        console.error('Failed to load objective exams:', error)
        setExams([])
      } finally {
        setIsLoading(false)
      }
    }
    loadExams()
  }, [])

  const handleStartExam = (exam: ExamCard) => {
    router.push(exam.route)
  }

  return (
    <div className="min-h-screen bg-cream">
      <StudentSidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <main className="py-8">
          <ExamListing
            title="Multiple Choice Exams"
            exams={exams}
            isLoading={isLoading}
            onStartExam={handleStartExam}
          />
        </main>
      </div>
    </div>
  )
}
