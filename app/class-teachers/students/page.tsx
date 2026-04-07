"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Search, Filter, Download, ChevronUp, ChevronDown, Eye } from "lucide-react"
import ClassTeacherSidebar from "@/components/class-teachers/ClassTeacherSidebar"
import ClassTeacherHeader from "@/components/class-teachers/ClassTeacherHeader"
import { useUser } from "@/contexts/UserContext"
import {
  getTeacherClasses,
  getClassStudentsWithAcademic,
  type ClassTeacherClass,
  type StudentAcademicRecord,
} from "@/lib/api/class-teacher-client"

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

function getPositionColor(position: number): string {
  if (position === 1) return "text-yellow-600 font-bold"
  if (position === 2) return "text-gray-500 font-bold"
  if (position === 3) return "text-amber-600 font-bold"
  if (position <= 10) return "text-green-600"
  if (position <= 25) return "text-blue-600"
  return "text-gray-600"
}

export default function StudentRecordsPage() {
  const { user, isLoading: userLoading } = useUser()
  const [classes, setClasses] = useState<ClassTeacherClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string>("")
  const [students, setStudents] = useState<StudentAcademicRecord[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentAcademicRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<"studentName" | "overallScore" | "attendance">("overallScore")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedStudent, setSelectedStudent] = useState<StudentAcademicRecord | null>(null)

  useEffect(() => {
    if (user && !userLoading) {
      loadClasses()
    }
  }, [user, userLoading])

  useEffect(() => {
    if (selectedClassId) {
      loadStudents()
    }
  }, [selectedClassId])

  useEffect(() => {
    filterAndSortStudents()
  }, [students, searchTerm, sortField, sortOrder])

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

  const loadStudents = async () => {
    if (!selectedClassId) return
    setIsLoading(true)
    try {
      const data = await getClassStudentsWithAcademic(selectedClassId)
      setStudents(data)
    } catch (error) {
      console.error("Failed to load students:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortStudents = () => {
    let result = [...students]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (s) =>
          s.studentName.toLowerCase().includes(term) ||
          s.admissionNo.toLowerCase().includes(term)
      )
    }

    result.sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      if (sortField === "studentName") {
        aVal = a.studentName
        bVal = b.studentName
        return sortOrder === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      } else {
        aVal = sortField === "overallScore" ? a.overallScore : a.attendance
        bVal = sortField === "overallScore" ? b.overallScore : b.attendance
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal
      }
    })

    setFilteredStudents(result)
  }

  const handleSort = (field: "studentName" | "overallScore" | "attendance") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const handleExport = () => {
    const csv = [
      ["Admission No", "Student Name", "Overall Score", "Grade", "Position", "Attendance", "Term"].join(","),
      ...filteredStudents.map(
        (s) =>
          `${s.admissionNo},${s.studentName},${s.overallScore},${s.overallGrade},${s.overallPosition},${s.attendance}%,${s.term}`
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const className = classes.find((c) => c.id === selectedClassId)?.class_name || "students"
    a.download = `${className}-records.csv`
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

          <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Records</h1>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Class:</label>
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

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or admission no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Admission No</th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("studentName")}
                    >
                      <div className="flex items-center gap-1">
                        Student Name
                        {sortField === "studentName" && (
                          sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("overallScore")}
                    >
                      <div className="flex items-center gap-1">
                        Score
                        {sortField === "overallScore" && (
                          sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Grade</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Position</th>
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("attendance")}
                    >
                      <div className="flex items-center gap-1">
                        Attendance
                        {sortField === "attendance" && (
                          sortOrder === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                        {selectedClassId ? "No student records found" : "Select a class to view records"}
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student, index) => (
                      <tr key={student.studentId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.admissionNo}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{student.studentName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.overallScore.toFixed(1)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(student.overallGrade)}`}>
                            {student.overallGrade}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm ${getPositionColor(student.overallPosition)}`}>
                          #{student.overallPosition}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.attendance}%</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-1 text-primary hover:bg-primary/10 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Student Details</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {selectedStudent.studentName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{selectedStudent.studentName}</h3>
                  <p className="text-gray-500">Admission No: {selectedStudent.admissionNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Overall Score</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedStudent.overallScore.toFixed(1)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Grade</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedStudent.overallGrade}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="text-2xl font-bold text-gray-800">#{selectedStudent.overallPosition}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Attendance</p>
                  <p className="text-2xl font-bold text-gray-800">{selectedStudent.attendance}%</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Term: {selectedStudent.term}</p>
                <p className="text-sm text-gray-500">Academic Year: {selectedStudent.academicYear}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Subject Performance</h4>
                <div className="space-y-2">
                  {selectedStudent.subjects.map((subj) => (
                    <div key={subj.subjectId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{subj.subjectName}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-600">{subj.score.toFixed(1)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getGradeColor(subj.grade)}`}>
                          {subj.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}