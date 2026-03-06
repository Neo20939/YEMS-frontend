"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  Calculator,
  PenTool,
  FlaskConical,
  TestTube,
  BookOpen,
  Dna,
  Clock,
  ChevronDown,
} from "lucide-react"

interface Assignment {
  id: string
  subject: string
  subjectIcon: React.ReactNode
  title: string
  description: string
  timeEstimate: string
  buttonText: string
  dueDate: string
  dueType: "today" | "days" | "week" | "weeks"
  daysLeft?: number
}

const assignments: Assignment[] = [
  {
    id: "1",
    subject: "Mathematics",
    subjectIcon: <Calculator className="w-5 h-5" />,
    title: "Linear Algebra Worksheet",
    description:
      "Complete exercises 1-15 on page 42 regarding vector spaces and linear transformations.",
    timeEstimate: "45 mins est.",
    buttonText: "Submit Now",
    dueDate: "Due Today",
    dueType: "today",
  },
  {
    id: "2",
    subject: "History",
    subjectIcon: <PenTool className="w-5 h-5" />,
    title: "The Industrial Revolution Essay",
    description:
      "Write a 1000-word essay analyzing the social and economic impacts of the Industrial Revolution in Europe.",
    timeEstimate: "2 hours est.",
    buttonText: "Continue",
    dueDate: "2 Days Left",
    dueType: "days",
    daysLeft: 2,
  },
  {
    id: "3",
    subject: "Physics",
    subjectIcon: <FlaskConical className="w-5 h-5" />,
    title: "Kinematics Lab Report",
    description:
      "Submit your lab findings on projectile motion. Include graphs and error analysis.",
    timeEstimate: "1.5 hours est.",
    buttonText: "Submit Now",
    dueDate: "3 Days Left",
    dueType: "days",
    daysLeft: 3,
  },
  {
    id: "4",
    subject: "Chemistry",
    subjectIcon: <TestTube className="w-5 h-5" />,
    title: "Periodic Table Quiz Prep",
    description:
      "Review groups 1, 2, 17, and 18. Complete the practice quiz online.",
    timeEstimate: "30 mins est.",
    buttonText: "Start Quiz",
    dueDate: "5 Days Left",
    dueType: "days",
    daysLeft: 5,
  },
  {
    id: "5",
    subject: "English Lit",
    subjectIcon: <BookOpen className="w-5 h-5" />,
    title: "Shakespeare Sonnet Analysis",
    description:
      "Read Sonnet 18 and Sonnet 130. Compare the themes of love and time.",
    timeEstimate: "1 hour est.",
    buttonText: "Submit Now",
    dueDate: "1 Week Left",
    dueType: "week",
  },
  {
    id: "6",
    subject: "Biology",
    subjectIcon: <Dna className="w-5 h-5" />,
    title: "Cell Division Project",
    description:
      "Create a digital presentation explaining the stages of Mitosis and Meiosis.",
    timeEstimate: "3 hours est.",
    buttonText: "Submit Now",
    dueDate: "2 Weeks Left",
    dueType: "weeks",
  },
]

export default function AssignmentsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active")

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
      {/* Header */}
      <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 shrink-0">
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-md bg-gray-50 rounded-lg px-3 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-800 placeholder-gray-400 focus:ring-0"
            placeholder="Search assignments, topics..."
            type="text"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button className="p-2 relative text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-50">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          {/* Page Title & Toggle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                My Assignments
              </h2>
              <p className="text-gray-500 mt-1">
                Manage your pending tasks and track your progress.
              </p>
            </div>
            {/* Toggle Switch */}
            <div className="bg-white p-1 rounded-lg border border-gray-100 inline-flex shadow-sm">
              <button
                className={`px-6 py-2 rounded-md font-medium text-sm shadow-sm transition-all ${
                  activeTab === "active"
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("active")}
              >
                Active
              </button>
              <button
                className={`px-6 py-2 rounded-md font-medium text-sm transition-all hover:bg-gray-50 ${
                  activeTab === "completed"
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("completed")}
              >
                Completed
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-500 cursor-pointer hover:border-primary hover:text-primary transition-colors">
              <span>All Subjects</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-500 cursor-pointer hover:border-primary hover:text-primary transition-colors">
              <span>Due Date: Earliest</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Assignment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Card Header */}
                <div className="bg-primary/5 p-5 border-b border-primary/10 flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      {assignment.subjectIcon}
                    </div>
                    <h3 className="font-bold text-primary text-lg">
                      {assignment.subject}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold border ${
                      assignment.dueType === "today"
                        ? "bg-white text-primary border-primary/20"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}
                  >
                    {assignment.dueDate}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {assignment.title}
                  </h4>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {assignment.description}
                  </p>

                  {/* Card Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{assignment.timeEstimate}</span>
                    </div>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                        assignment.buttonText === "Continue"
                          ? "bg-white border border-primary text-primary hover:bg-primary/5"
                          : "bg-primary text-white hover:bg-primary-dark shadow-primary/30"
                      }`}
                    >
                      {assignment.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
