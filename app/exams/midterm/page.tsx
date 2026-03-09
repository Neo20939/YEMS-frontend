"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { StudentSidebar } from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { MidtermListing } from "@/components/exam/midterm-listing"
import type { MidtermCard } from "@/components/exam/midterm-listing"
import { getExams } from "@/lib/api/exam-client"
import { useUser } from "@/contexts/UserContext"

export default function MidTermExamsPage() {
  const router = useRouter()
  const { user } = useUser()
  const [midterms, setMidterms] = React.useState<MidtermCard[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    async function loadMidterms() {
      setIsLoading(true)
      try {
        // Fetch objective exams from API (midterms are objective MCQs)
        const apiExams = await getExams('objective')
        
        // Convert API format to MidtermCard format
        const convertedMidterms: MidtermCard[] = apiExams.map(exam => ({
          id: exam.id,
          title: exam.title,
          description: exam.description,
          duration: exam.duration,
          questions: exam.totalQuestions,
          iconType: exam.iconType || 'science',
          status: exam.status === 'not-started' ? 'not-started' : 
                  exam.status === 'in-progress' ? 'new' : 
                  exam.status === 'completed' ? 'locked' : 'upcoming',
          route: `/objective-exam?id=${exam.id}`,
        }))
        
        setMidterms(convertedMidterms)
      } catch (error) {
        console.error('Failed to load midterms:', error)
        setMidterms([])
      } finally {
        setIsLoading(false)
      }
    }
    loadMidterms()
  }, [])

  const handleStartExam = (midterm: MidtermCard) => {
    if (midterm.status !== "locked" && midterm.status !== "upcoming") {
      router.push(midterm.route)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <StudentSidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <main className="py-8">
          <MidtermListing
            midterms={midterms}
            isLoading={isLoading}
            onStartExam={handleStartExam}
          />
        </main>
      </div>
    </div>
  )
}
