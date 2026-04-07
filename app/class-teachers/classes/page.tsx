"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Users, Calendar, BookOpen, TrendingUp, Award } from "lucide-react"
import ClassTeacherSidebar from "@/components/class-teachers/ClassTeacherSidebar"
import ClassTeacherHeader from "@/components/class-teachers/ClassTeacherHeader"
import { useUser } from "@/contexts/UserContext"
import {
  getTeacherClasses,
  getClassAcademicSummary,
  type ClassTeacherClass,
  type ClassAcademicSummary,
} from "@/lib/api/class-teacher-client"

export default function MyClassesPage() {
  const { user, isLoading: userLoading } = useUser()
  const [classes, setClasses] = useState<ClassTeacherClass[]>([])
  const [selectedClass, setSelectedClass] = useState<ClassAcademicSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && !userLoading) {
      loadClasses()
    }
  }, [user, userLoading])

  const loadClasses = async () => {
    if (!user?.id) return
    setIsLoading(true)
    try {
      const data = await getTeacherClasses(user.id)
      setClasses(data)
    } catch (error) {
      console.error("Failed to load classes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadClassDetails = async (classId: string) => {
    try {
      const data = await getClassAcademicSummary(classId)
      setSelectedClass(data)
    } catch (error) {
      console.error("Failed to load class details:", error)
    }
  }

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <ClassTeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <ClassTeacherHeader teacherName={user?.name} />
        
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          <div className="mb-6">
            <Link
              href="/class-teachers"
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Classes</h1>

          {classes.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <p className="text-gray-500">No classes assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => loadClassDetails(cls.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{cls.class_name}</h3>
                      <p className="text-sm text-gray-500">{cls.level} - {cls.stream}</p>
                    </div>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-lg font-bold text-gray-800">{cls.enrolled_count || 0}</p>
                        <p className="text-xs text-gray-500">Students</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-lg font-bold text-gray-800">{cls.passRate?.toFixed(0) || 0}%</p>
                        <p className="text-xs text-gray-500">Pass Rate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-lg font-bold text-gray-800">{cls.averageGrade?.toFixed(1) || 0}</p>
                        <p className="text-xs text-gray-500">Avg Score</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Academic Year: {cls.academic_year}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedClass && (
            <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {selectedClass.className} - Academic Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedClass.totalStudents}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Average Score</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedClass.averageScore.toFixed(1)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Pass Rate</p>
                  <p className="text-2xl font-bold text-green-600">{selectedClass.passRate.toFixed(1)}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Highest Score</p>
                  <p className="text-2xl font-bold text-primary">{selectedClass.highestScore}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}