"use client"

import { GraduationCap, Users, TrendingUp, Award } from "lucide-react"
import type { ClassTeacherClass } from "@/lib/api/class-teacher-client"

interface ClassTeacherHeroProps {
  teacherName: string
  classes: ClassTeacherClass[]
}

export default function ClassTeacherHero({
  teacherName,
  classes,
}: ClassTeacherHeroProps) {
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || cls.enrolled_count || 0), 0)
  const avgPassRate = classes.length > 0
    ? classes.reduce((sum, cls) => sum + (cls.passRate || 0), 0) / classes.length
    : 0
  const avgGrade = classes.length > 0
    ? classes.reduce((sum, cls) => sum + (cls.averageGrade || 0), 0) / classes.length
    : 0

  const stats = [
    {
      label: "Assigned Classes",
      value: classes.length,
      icon: GraduationCap,
      color: "bg-blue-500",
    },
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "bg-green-500",
    },
    {
      label: "Average Pass Rate",
      value: `${avgPassRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "bg-amber-500",
    },
    {
      label: "Average Score",
      value: avgGrade.toFixed(1),
      icon: Award,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {teacherName}
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor your classes and student academic performance
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Academic Year</p>
          <p className="text-lg font-semibold text-gray-800">2025-2026</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {classes.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">Your Assigned Classes</h3>
          <div className="flex flex-wrap gap-2">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="px-4 py-2 bg-primary/5 text-primary rounded-lg text-sm font-medium"
              >
                {cls.class_name} ({cls.level}-{cls.stream})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}