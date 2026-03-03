import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import { NotesDashboard } from "@/components/NotesDashboard"

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <NotesDashboard />
      </div>
    </div>
  )
}
