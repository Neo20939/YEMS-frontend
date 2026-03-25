"use client"

import TeacherSidebar from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"
import { useState, useEffect } from "react"
import { useUser } from "@/contexts/UserContext"

interface StudentResult {
  id: string
  studentId: string
  studentName: string
  studentClass: string
  examId?: string
  examTitle?: string
  examType?: "objective" | "theory" | "mixed"
  assignmentId?: string
  assignmentTitle?: string
  score: number
  totalScore: number
  percentage: number
  grade: string
  status: "submitted" | "graded" | "pending"
  submittedAt: string
  gradedAt?: string
}

interface FilterState {
  classGrade: string
  assessmentType: "all" | "exam" | "assignment"
  searchTerm: string
}

export default function StudentResultsPage() {
  const { user, isLoading } = useUser()
  const [results, setResults] = useState<StudentResult[]>([])
  const [filteredResults, setFilteredResults] = useState<StudentResult[]>([])
  const [filters, setFilters] = useState<FilterState>({
    classGrade: "all",
    assessmentType: "all",
    searchTerm: "",
  })

  const classGrades = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"]

  useEffect(() => {
    loadResults()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, results])

  async function loadResults() {
    // Mock data - replace with actual API call
    const mockResults: StudentResult[] = [
      {
        id: "R001",
        studentId: "S001",
        studentName: "John Doe",
        studentClass: "SS1",
        examId: "EX001",
        examTitle: "Mathematics Mid-Term",
        examType: "objective",
        score: 75,
        totalScore: 100,
        percentage: 75,
        grade: "B",
        status: "graded",
        submittedAt: "2024-10-15T10:30:00Z",
        gradedAt: "2024-10-16T14:00:00Z",
      },
      {
        id: "R002",
        studentId: "S002",
        studentName: "Jane Smith",
        studentClass: "SS1",
        examId: "EX001",
        examTitle: "Mathematics Mid-Term",
        examType: "objective",
        score: 88,
        totalScore: 100,
        percentage: 88,
        grade: "A",
        status: "graded",
        submittedAt: "2024-10-15T10:30:00Z",
        gradedAt: "2024-10-16T14:00:00Z",
      },
      {
        id: "R003",
        studentId: "S003",
        studentName: "Michael Johnson",
        studentClass: "SS2",
        examId: "EX002",
        examTitle: "Physics Theory Exam",
        examType: "theory",
        score: 62,
        totalScore: 100,
        percentage: 62,
        grade: "C",
        status: "graded",
        submittedAt: "2024-10-18T09:00:00Z",
        gradedAt: "2024-10-20T11:00:00Z",
      },
      {
        id: "R004",
        studentId: "S004",
        studentName: "Sarah Williams",
        studentClass: "SS1",
        assignmentId: "A001",
        assignmentTitle: "Algebraic Expressions Worksheet",
        score: 45,
        totalScore: 50,
        percentage: 90,
        grade: "A",
        status: "graded",
        submittedAt: "2024-10-20T23:59:00Z",
        gradedAt: "2024-10-21T10:00:00Z",
      },
      {
        id: "R005",
        studentId: "S005",
        studentName: "David Brown",
        studentClass: "SS3",
        examId: "EX003",
        examTitle: "Chemistry Mid-Term",
        examType: "mixed",
        score: 0,
        totalScore: 100,
        percentage: 0,
        grade: "F",
        status: "pending",
        submittedAt: "2024-10-22T10:30:00Z",
      },
      {
        id: "R006",
        studentId: "S006",
        studentName: "Emily Davis",
        studentClass: "SS2",
        assignmentId: "A002",
        assignmentTitle: "Physics Lab Report",
        score: 85,
        totalScore: 100,
        percentage: 85,
        grade: "A",
        status: "graded",
        submittedAt: "2024-10-15T23:59:00Z",
        gradedAt: "2024-10-16T09:00:00Z",
      },
    ]

    setResults(mockResults)
  }

  function applyFilters() {
    let filtered = [...results]

    if (filters.classGrade !== "all") {
      filtered = filtered.filter((r) => r.studentClass === filters.classGrade)
    }

    if (filters.assessmentType === "exam") {
      filtered = filtered.filter((r) => r.examId)
    } else if (filters.assessmentType === "assignment") {
      filtered = filtered.filter((r) => r.assignmentId)
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.studentName.toLowerCase().includes(term) ||
          r.examTitle?.toLowerCase().includes(term) ||
          r.assignmentTitle?.toLowerCase().includes(term)
      )
    }

    setFilteredResults(filtered)
  }

  function getGradeColor(grade: string) {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-700"
      case "B":
        return "bg-blue-100 text-blue-700"
      case "C":
        return "bg-yellow-100 text-yellow-700"
      case "D":
        return "bg-orange-100 text-orange-700"
      case "F":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "graded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Graded
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            Pending
          </span>
        )
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Submitted
          </span>
        )
      default:
        return null
    }
  }

  function getAssessmentType(result: StudentResult) {
    if (result.examId) {
      return {
        type: "Exam",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        color: "text-blue-600",
      }
    } else if (result.assignmentId) {
      return {
        type: "Assignment",
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        color: "text-purple-600",
      }
    }
    return { type: "Unknown", icon: null, color: "text-gray-600" }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: filteredResults.length,
    graded: filteredResults.filter((r) => r.status === "graded").length,
    pending: filteredResults.filter((r) => r.status === "pending").length,
    average:
      filteredResults.length > 0
        ? Math.round(
            filteredResults.reduce((acc, r) => acc + r.percentage, 0) /
              filteredResults.length
          )
        : 0,
  }

  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="bg-primary rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  Student Results Dashboard
                </div>
                <h1 className="text-4xl font-bold mb-3">View Student Results</h1>
                <p className="text-white/80 text-lg">Track and analyze student performance across exams and assignments.</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Results</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Graded</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.graded}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Class Average</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.average}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filters
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search students or assessments..."
                      value={filters.searchTerm}
                      onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                      className="pl-9 py-2.5 rounded-xl border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-primary w-64"
                    />
                  </div>

                  {/* Class Filter */}
                  <select
                    value={filters.classGrade}
                    onChange={(e) => setFilters({ ...filters, classGrade: e.target.value })}
                    className="py-2.5 px-4 rounded-xl border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="all">All Classes</option>
                    {classGrades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>

                  {/* Assessment Type Filter */}
                  <select
                    value={filters.assessmentType}
                    onChange={(e) => setFilters({ ...filters, assessmentType: e.target.value as "all" | "exam" | "assignment" })}
                    className="py-2.5 px-4 rounded-xl border-gray-200 bg-gray-50 text-sm focus:border-primary focus:ring-primary"
                  >
                    <option value="all">All Assessments</option>
                    <option value="exam">Exams Only</option>
                    <option value="assignment">Assignments Only</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Assessment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredResults.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center">
                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-gray-500 font-medium">No results found</p>
                            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredResults.map((result) => {
                        const assessmentType = getAssessmentType(result)
                        return (
                          <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                                  {result.studentName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{result.studentName}</p>
                                  <p className="text-sm text-gray-500">{result.studentClass}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {result.examTitle || result.assignmentTitle}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {result.examType ? result.examType.charAt(0).toUpperCase() + result.examType.slice(1) : ""}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`flex items-center gap-2 ${assessmentType.color}`}>
                                {assessmentType.icon}
                                <span className="text-sm font-medium">{assessmentType.type}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-bold text-gray-900">
                                  {result.score} / {result.totalScore}
                                </p>
                                <p className="text-sm text-gray-500">{result.percentage}%</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(result.grade)}`}>
                                {result.grade}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(result.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {new Date(result.submittedAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(result.submittedAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 text-gray-700 transition-colors"
                                  onClick={() => console.log("View details", result.id)}
                                >
                                  View
                                </button>
                                {result.status === "pending" && (
                                  <button
                                    className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                                    onClick={() => console.log("Grade now", result.id)}
                                  >
                                    Grade
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
