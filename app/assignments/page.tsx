import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import AssignmentsPage from "@/components/layout/AssignmentsPage"

export default function Assignments() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <AssignmentsPage />
      </div>
    </div>
  )
}
