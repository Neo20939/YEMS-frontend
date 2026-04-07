"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Filter, Download } from "lucide-react"
import {
  getTeacherClasses,
  getClassStudentsWithAcademic,
  type ClassTeacherClass,
  type StudentAcademicRecord,
} from "@/lib/api/class-teacher-client"
import { useUser } from "@/contexts/UserContext"

interface ClassTeacherDashboardProps {
  classes: ClassTeacherClass[]
}

function getGradeColor(grade: string): string {
  const colors: Record<string, string> = {
    A: "bg-green-100 text-green-800",
    B: "bg-blue-100 text-blue-800",
    C: "bg-yellow-100 text-yellow-800",
    D: "bg-orange-100 text-orange-800",
    F: "bg-red-100 text-red-800",
  }
  return colors[grade] || "bg-gray-100 text-gray-800"
}

function getPositionColor(position: number, total: number): string {
  const percentage = (position / total) * 100
  if (percentage <= 10) return "text-green-600 font-bold"
  if (percentage <= 25) return "text-blue-600"
  if (percentage <= 50) return "text-yellow-600"
  return "text-gray-600"
}

export default function ClassTeacherDashboard({ classes }: ClassTeacherDashboardProps) {
  const { user } = useUser()
  const [selectedClass, setSelectedClass] = useState<ClassTeacherClass | null>(
    classes.length > 0 ? classes[0] : null
  )
  const [students, setStudents] = useState<StudentAcademicRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sortField, setSortField] = useState<"overallScore" | "attendance">("overallScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    if (selectedClass) {
      loadStudents()
    }
  }, [selectedClass])

  const loadStudents = async () => {
    if (!selectedClass) return
    setIsLoading(true)
    try {
      const data = await getClassStudentsWithAcademic(selectedClass.id)
      setStudents(data)
    } catch (error) {
      console.error("Failed to load students:", error)
      setStudents([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = (field: "overallScore" | "attendance") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const sortedStudents = [...students].sort((a, b) => {
    const aVal = sortField === "overallScore" ? a.overallScore : a.attendance
    const bVal = sortField === "overallScore" ? b.overallScore : b.attendance
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal
  })

  const handleExport = () => {
    const csv = [
      ["Admission No", "Student Name", "Overall Score", "Grade", "Position", "Attendance"].join(","),
      ...sortedStudents.map(
        (s) =>
          `${s.admissionNo},${s.studentName},${s.overallScore},${s.overallGrade},${s.overallPosition},${s.attendance}%`
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedClass?.class_name || " class"}-academic-records.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Select Class:</label>
          <select
            value={selectedClass?.id || ""}
            onChange={(e) => {
              const cls = classes.find((c) => c.id === e.target.value)
              setSelectedClass(cls || null)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.class_name} ({cls.level}-{cls.stream})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {selectedClass && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500">Total Students</p>
            <p className="text-2xl font-bold text-gray-800">{students.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500">Class Average</p>
            <p className="text-2xl font-bold text-gray-800">
              {students.length > 0
                ? (
                    students.reduce((sum, s) => sum + s.overallScore, 0) / students.length
                  ).toFixed(1)
                : 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500">Pass Rate</p>
            <p className="text-2xl font-bold text-gray-800">
              {students.length > 0
                ? (
                    (students.filter((s) => s.overallScore >= 50).length /
                      students.length) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500">Highest Score</p>
            <p className="text-2xl font-bold text-green-600">
              {students.length > 0
                ? Math.max(...students.map((s) => s.overallScore))
                : 0}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Admission No
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Student Name
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("overallScore")}
                >
                  <div className="flex items-center gap-1">
                    Score
                    {sortField === "overallScore" && (
                      <span className="text-primary">
                        {sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Grade
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  Position
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("attendance")}
                >
                  <div className="flex items-center gap-1">
                    Attendance
                    {sortField === "attendance" && (
                      <span className="text-primary">
                        {sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Loading student records...
                  </td>
                </tr>
              ) : sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    {selectedClass
                      ? "No student records found for this class"
                      : "Select a class to view student records"}
                  </td>
                </tr>
              ) : (
                sortedStudents.map((student, index) => (
                  <tr key={student.studentId} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.admissionNo}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                      {student.studentName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.overallScore.toFixed(1)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(
                          student.overallGrade
                        )}`}
                      >
                        {student.overallGrade}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-sm ${getPositionColor(
                        student.overallPosition,
                        students.length
                      )}`}
                    >
                      {student.overallPosition}
                      {student.overallPosition === 1 && " 🥇"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {student.attendance}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}