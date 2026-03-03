import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import LiveLessons from "@/components/layout/LiveLessons"

export default function LiveLessonsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <LiveLessons />
      </div>
    </div>
  )
}
