"use client"

import { useState, useEffect } from "react"
import ClassTeacherSidebar from "@/components/class-teachers/ClassTeacherSidebar"
import ClassTeacherHeader from "@/components/class-teachers/ClassTeacherHeader"
import ClassTeacherHero from "@/components/class-teachers/ClassTeacherHero"
import ClassTeacherDashboard from "@/components/class-teachers/ClassTeacherDashboard"
import { useUser } from "@/contexts/UserContext"
import { getTeacherClasses, type ClassTeacherClass } from "@/lib/api/class-teacher-client"

export default function ClassTeacherDashboardPage() {
  const { user, isLoading: userLoading } = useUser()
  const [classes, setClasses] = useState<ClassTeacherClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user && !userLoading) {
      loadClasses()
    }
  }, [user, userLoading])

  const loadClasses = async () => {
    if (!user?.id) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getTeacherClasses(user.id)
      setClasses(data)
    } catch (err) {
      console.error("Failed to load classes:", err)
      setError("Failed to load classes. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <ClassTeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <ClassTeacherHeader teacherName={user.name} />
        
        {error && (
          <div className="max-w-7xl mx-auto px-6 md:px-8 mt-4">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          <div className="space-y-8">
            <ClassTeacherHero teacherName={user.name} classes={classes} />
            
            {classes.length > 0 ? (
              <ClassTeacherDashboard classes={classes} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <p className="text-gray-500">
                  No classes assigned yet. Please contact the admin to assign classes to you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}