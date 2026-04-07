"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, FileText, BarChart3, TrendingUp, Award, Calendar } from "lucide-react"
import ClassTeacherSidebar from "@/components/class-teachers/ClassTeacherSidebar"
import ClassTeacherHeader from "@/components/class-teachers/ClassTeacherHeader"
import { useUser } from "@/contexts/UserContext"
import {
  getTeacherClasses,
  getClassAcademicSummary,
  type ClassTeacherClass,
  type ClassAcademicSummary,
} from "@/lib/api/class-teacher-client"

export default function AcademicReportsPage() {
  const { user, isLoading: userLoading } = useUser()
  const [classes, setClasses] = useState<ClassTeacherClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [classSummary, setClassSummary] = useState<ClassAcademicSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && !userLoading) {
      loadClasses()
    }
  }, [user, userLoading])

  useEffect(() => {
    if (selectedClassId) {
      loadClassSummary()
    }
  }, [selectedClassId])

  const loadClasses = async () => {
    if (!user?.id) return
    try {
      const data = await getTeacherClasses(user.id)
      setClasses(data)
      if (data.length > 0) {
        setSelectedClassId(data[0].id)
      }
    } catch (error) {
      console.error("Failed to load classes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadClassSummary = async () => {
    if (!selectedClassId) return
    try {
      const data = await getClassAcademicSummary(selectedClassId)
      setClassSummary(data)
    } catch (error) {
      console.error("Failed to load class summary:", error)
    }
  }

  const generateReport = (type: "summary" | "detailed" | "subject") => {
    if (!classSummary) return

    let content = ""
    let filename = ""

    if (type === "summary") {
      filename = `${classSummary.className}-summary-report.txt`
      content = `
ACADEMIC SUMMARY REPORT
========================
Class: ${classSummary.className}
Total Students: ${classSummary.totalStudents}
Average Score: ${classSummary.averageScore.toFixed(2)}
Pass Rate: ${classSummary.passRate.toFixed(2)}%
Highest Score: ${classSummary.highestScore}
Lowest Score: ${classSummary.lowestScore}
Generated: ${new Date().toLocaleDateString()}
      `.trim()
    } else if (type === "subject") {
      filename = `${classSummary.className}-subject-analysis.txt`
      content = `
SUBJECT PERFORMANCE ANALYSIS
=============================
Class: ${classSummary.className}
${classSummary.subjectPerformances.map(s => `
${s.subjectName}
- Average Score: ${s.averageScore.toFixed(2)}
- Pass Rate: ${s.passRate.toFixed(2)}%
`).join("")}
Generated: ${new Date().toLocaleDateString()}
      `.trim()
    }

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
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

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Academic Reports</h1>

          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-gray-700">Select Class:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} ({cls.level}-{cls.stream})
                </option>
              ))}
            </select>
          </div>

          {classSummary ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-500">Total Students</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{classSummary.totalStudents}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-500">Class Average</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{classSummary.averageScore.toFixed(1)}</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-sm text-gray-500">Pass Rate</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{classSummary.passRate.toFixed(1)}%</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-500">Score Range</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-800">
                    {classSummary.lowestScore} - {classSummary.highestScore}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Subject Performance</h2>
                  <button
                    onClick={() => generateReport("subject")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Download className="w-4 h-4" />
                    Export Subject Report
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subject</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Average Score</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Pass Rate</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {classSummary.subjectPerformances.map((subj) => (
                        <tr key={subj.subjectId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{subj.subjectName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{subj.averageScore.toFixed(1)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{subj.passRate.toFixed(1)}%</td>
                          <td className="px-4 py-3">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  subj.passRate >= 80
                                    ? "bg-green-500"
                                    : subj.passRate >= 60
                                    ? "bg-blue-500"
                                    : subj.passRate >= 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${subj.passRate}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Class Summary Report</h2>
                  <button
                    onClick={() => generateReport("summary")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Class</p>
                    <p className="font-semibold text-gray-800">{classSummary.className}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Students</p>
                    <p className="font-semibold text-gray-800">{classSummary.totalStudents}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Average Score</p>
                    <p className="font-semibold text-gray-800">{classSummary.averageScore.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Pass Rate</p>
                    <p className="font-semibold text-green-600">{classSummary.passRate.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Highest Score</p>
                    <p className="font-semibold text-gray-800">{classSummary.highestScore}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lowest Score</p>
                    <p className="font-semibold text-gray-800">{classSummary.lowestScore}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a class to view academic reports</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}