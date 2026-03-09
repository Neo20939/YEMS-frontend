"use client"

import TeacherSidebar from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"
import TeacherHero from "@/components/teachers/TeacherHero"
import TeacherActionCards from "@/components/teachers/TeacherActionCards"
import SchoolNews from "@/components/shared/SchoolNews"
import TeacherMeetingsPanel from "@/components/teachers/TeacherMeetingsPanel"
import { useUser } from "@/contexts/UserContext"

export default function TeacherDashboardPage() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />
        <TeacherHero teacherName={user?.name || "Teacher"} />
        <TeacherActionCards />

        <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <SchoolNews />
            <TeacherMeetingsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
