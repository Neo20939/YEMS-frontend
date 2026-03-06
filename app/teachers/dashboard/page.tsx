import TeacherSidebar from "@/components/layout/TeacherSidebar"
import TeacherHeader from "@/components/layout/TeacherHeader"
import TeacherHero from "@/components/layout/TeacherHero"
import TeacherActionCards from "@/components/layout/TeacherActionCards"
import SchoolNews from "@/components/layout/SchoolNews"
import TeacherMeetingsPanel from "@/components/layout/TeacherMeetingsPanel"

export default function TeacherDashboardPage() {
  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />
        <TeacherHero />
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
