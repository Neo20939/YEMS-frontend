"use client"

import Sidebar from "@/components/layout/Sidebar/StudentSidebar"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardHero from "@/components/dashboard/DashboardHero"
import DashboardCards from "@/components/dashboard/DashboardCards"
import SchoolNews from "@/components/shared/SchoolNews"
import DeadlinesPanel from "@/components/shared/DeadlinesPanel"
import DashboardFooter from "@/components/dashboard/DashboardFooter"
import { useUser } from "@/contexts/UserContext"

export default function DashboardPage() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <DashboardHero studentName={user?.name || "Student"} />
        <DashboardCards />

        <div className="max-w-7xl mx-auto px-6 md:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <SchoolNews />
            <DeadlinesPanel />
          </div>
        </div>

        <DashboardFooter />
      </div>
    </div>
  )
}
