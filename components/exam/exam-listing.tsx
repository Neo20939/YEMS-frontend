"use client"

import * as React from "react"
import { Clock, FileText, AlertCircle, Lock, Brain, Globe, PenTool, Lightbulb, History, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ExamCard {
  /** Unique exam identifier */
  id: string
  /** Exam title */
  title: string
  /** Exam description/subtitle */
  description: string
  /** Duration in minutes */
  duration: number
  /** Number of questions */
  questions: number
  /** Question type label */
  questionType: string
  /** Exam status */
  status: "not-started" | "upcoming" | "new" | "locked"
  /** Subject icon type */
  iconType: "math" | "science" | "english" | "philosophy" | "history" | "computer"
  /** Route to navigate to */
  route: string
}

export interface ExamListingProps {
  /** Page title (e.g., "Multiple Choice Exams") */
  title: string
  /** Subtitle text */
  subtitle?: string
  /** Academic session label */
  sessionLabel?: string
  /** List of exams to display */
  exams: ExamCard[]
  /** Callback when Start Exam is clicked */
  onStartExam?: (exam: ExamCard) => void
  /** Additional className */
  className?: string
}

const ExamListing = React.forwardRef<HTMLDivElement, ExamListingProps>(
  (
    {
      title,
      subtitle = "View and manage your scheduled assessments. Ensure you have a stable internet connection before starting any exam.",
      sessionLabel = "ACADEMIC SESSION 2024/2025",
      exams,
      onStartExam,
      className,
    },
    ref
  ) => {
    const [filter, setFilter] = React.useState<"all" | "upcoming">("all")

    const filteredExams = React.useMemo(() => {
      if (filter === "upcoming") {
        return exams.filter((exam) => exam.status === "upcoming")
      }
      return exams
    }, [exams, filter])

    const handleStartExam = (exam: ExamCard) => {
      if (exam.status !== "locked" && onStartExam) {
        onStartExam(exam)
      }
    }

    return (
      <div ref={ref} className={cn("w-full max-w-7xl mx-auto px-6 py-8", className)}>
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-500 rounded-2xl p-8 mb-8 text-white shadow-xl">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide mb-4">
              {sessionLabel}
            </span>
            <h1 className="text-4xl font-bold mb-3">{title}</h1>
            <p className="text-white/90 text-sm max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded bg-rose-100 text-rose-600">
              <FileText className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Available Assessments
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                filter === "all"
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              All Subjects
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
                filter === "upcoming"
                  ? "bg-rose-50 text-rose-600 border-rose-200"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              )}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredExams.map((exam) => (
            <ExamCardItem key={exam.id} exam={exam} onClick={handleStartExam} />
          ))}
        </div>

        {/* Empty State */}
        {filteredExams.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
              <AlertCircle className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              No exams found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              {filter === "upcoming"
                ? "No upcoming exams at the moment."
                : "No assessments available."}
            </p>
          </div>
        )}

        {/* Support Text */}
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            Having trouble? Contact our{" "}
            <button className="text-rose-600 hover:text-rose-700 font-medium underline underline-offset-2">
              technical support team
            </button>
          </p>
        </div>
      </div>
    )
  }
)

ExamListing.displayName = "ExamListing"

interface ExamCardItemProps {
  exam: ExamCard
  onClick: (exam: ExamCard) => void
}

const ExamCardItem = ({ exam, onClick }: ExamCardItemProps) => {
  const IconComponent = getIconComponent(exam.iconType)
  const iconBgColor = getIconBgColor(exam.iconType)
  const statusConfig = getStatusConfig(exam.status)

  const isLocked = exam.status === "locked"

  return (
    <div
      className={cn(
        "group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300",
        !isLocked &&
          "hover:shadow-xl hover:border-rose-200 dark:hover:border-rose-800 cursor-pointer hover:-translate-y-1"
      )}
      onClick={() => !isLocked && onClick(exam)}
      role={!isLocked ? "button" : undefined}
      tabIndex={!isLocked ? 0 : undefined}
      onKeyDown={
        !isLocked
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick(exam)
              }
            }
          : undefined
      }
    >
      {/* Header: Icon + Status */}
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "flex items-center justify-center w-12 h-12 rounded-xl",
            iconBgColor
          )}
        >
          <IconComponent className="h-6 w-6" />
        </div>
        <span
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-semibold",
            statusConfig.bgColor,
            statusConfig.textColor
          )}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {exam.title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
        {exam.description}
      </p>

      {/* Meta Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>Duration: {exam.duration} mins</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <FileText className="h-4 w-4 text-slate-400" />
          <span>
            Questions: {exam.questions} {exam.questionType}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {isLocked ? (
        <Button
          className="w-full bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
          size="lg"
          disabled
        >
          <Lock className="h-4 w-4 mr-2" />
          Locked
        </Button>
      ) : (
        <Button
          className="w-full bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-500/30"
          size="lg"
          onClick={(e) => {
            e.stopPropagation()
            onClick(exam)
          }}
        >
          Start Exam
        </Button>
      )}
    </div>
  )
}

function getIconComponent(iconType: ExamCard["iconType"]) {
  switch (iconType) {
    case "math":
      return Brain
    case "science":
      return Brain
    case "english":
      return Globe
    case "philosophy":
      return Lightbulb
    case "history":
      return History
    case "computer":
      return Laptop
    default:
      return Brain
  }
}

function getIconBgColor(iconType: ExamCard["iconType"]) {
  switch (iconType) {
    case "math":
      return "bg-rose-50 text-rose-600"
    case "science":
      return "bg-blue-50 text-blue-600"
    case "english":
      return "bg-emerald-50 text-emerald-600"
    case "philosophy":
      return "bg-purple-50 text-purple-600"
    case "history":
      return "bg-orange-50 text-orange-600"
    case "computer":
      return "bg-indigo-50 text-indigo-600"
    default:
      return "bg-slate-50 text-slate-600"
  }
}

function getStatusConfig(status: ExamCard["status"]) {
  switch (status) {
    case "not-started":
      return { bgColor: "bg-amber-50", textColor: "text-amber-700", label: "NOT STARTED" }
    case "upcoming":
      return { bgColor: "bg-blue-50", textColor: "text-blue-700", label: "UPCOMING" }
    case "new":
      return { bgColor: "bg-emerald-50", textColor: "text-emerald-700", label: "NEW" }
    case "locked":
      return { bgColor: "bg-slate-100", textColor: "text-slate-500", label: "LOCKED" }
  }
}

export { ExamListing }
