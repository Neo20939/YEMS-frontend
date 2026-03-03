import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import DashboardHero from "@/components/layout/DashboardHero"
import DashboardCards from "@/components/layout/DashboardCards"
import SchoolNews from "@/components/layout/SchoolNews"
import DeadlinesPanel from "@/components/layout/DeadlinesPanel"
import DashboardFooter from "@/components/layout/DashboardFooter"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <DashboardHero />
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
