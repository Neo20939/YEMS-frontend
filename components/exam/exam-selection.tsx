"use client"

import * as React from "react"
import { FileCheck, PenTool, AlertCircle, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExamTypeCard {
  /** Exam type identifier */
  type: "objective" | "theory" | "midterm"
  /** Card title */
  title: string
  /** Card description */
  description: string
  /** Route to navigate to */
  route: string
  /** Whether the exam type is available */
  available?: boolean
}

export interface ExamSelectionProps {
  /** Exam session label (e.g., "ACADEMIC SESSION 2024/2025") */
  sessionLabel?: string
  /** Main heading */
  heading?: string
  /** Subtitle text */
  subtitle?: string
  /** Exam type cards */
  examTypes?: ExamTypeCard[]
  /** Callback when an exam type is selected */
  onExamTypeSelect?: (type: ExamTypeCard) => void
  /** Support contact text */
  supportText?: string
  /** Additional className */
  className?: string
}

const ExamSelection = React.forwardRef<HTMLDivElement, ExamSelectionProps>(
  (
    {
      sessionLabel = "ACADEMIC SESSION 2024/2025",
      heading = "Select Exam Type",
      subtitle = "Choose your preferred examination format to begin. Ensure you have a stable internet connection before starting.",
      examTypes = [
        {
          type: "objective",
          title: "Multiple Choice Exam",
          description:
            "A standardized assessment format consisting of questions with predefined options. Best for testing factual knowledge and quick recall.",
          route: "/exams/objective",
          available: true,
        },
        {
          type: "theory",
          title: "Theory Examination",
          description:
            "Comprehensive assessment requiring detailed written responses. Evaluate your critical thinking, analysis, and descriptive abilities.",
          route: "/exams/theory",
          available: true,
        },
        {
          type: "midterm",
          title: "Mid Term Exams",
          description:
            "Semester midterm assessments covering all topics studied so far. Test your overall understanding and readiness.",
          route: "/exams/midterm",
          available: true,
        },
      ],
      onExamTypeSelect,
      supportText = "Having trouble? Contact our technical support team.",
      className,
    },
    ref
  ) => {
    const handleCardClick = (examType: ExamTypeCard) => {
      if (examType.available && onExamTypeSelect) {
        onExamTypeSelect(examType)
      }
    }

    return (
      <div ref={ref} className={cn("w-full max-w-5xl mx-auto px-6 py-8", className)}>
        {/* Header Banner */}
        <div className="bg-primary rounded-2xl p-8 mb-10 text-white shadow-soft">
          <div className="text-center">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide mb-4">
              {sessionLabel}
            </span>
            <h1 className="text-4xl font-bold mb-3">{heading}</h1>
            <p className="text-white/90 text-sm max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Exam Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {examTypes.map((examType) => (
            <ExamTypeCardItem
              key={examType.type}
              examType={examType}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {/* Support Text */}
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            {supportText.split("technical support team").map((part, index, arr) => (
              <React.Fragment key={index}>
                {part}
                {index < arr.length - 1 && (
                  <button className="text-primary hover:text-primary-light font-medium underline underline-offset-2">
                    technical support team
                  </button>
                )}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
    )
  }
)

ExamSelection.displayName = "ExamSelection"

interface ExamTypeCardItemProps {
  examType: ExamTypeCard
  onClick: (examType: ExamTypeCard) => void
}

const ExamTypeCardItem = ({ examType, onClick }: ExamTypeCardItemProps) => {
  const isObjective = examType.type === "objective"
  const isTheory = examType.type === "theory"
  const isMidterm = examType.type === "midterm"

  const IconComponent = isObjective ? FileCheck : isTheory ? PenTool : BookOpen

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 transition-all duration-300",
        examType.available
          ? "hover:shadow-xl hover:border-primary-light dark:hover:border-primary-light cursor-pointer hover:-translate-y-1"
          : "opacity-60 cursor-not-allowed"
      )}
      onClick={() => examType.available && onClick(examType)}
      role={examType.available ? "button" : undefined}
      tabIndex={examType.available ? 0 : undefined}
      onKeyDown={
        examType.available
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick(examType)
              }
            }
          : undefined
      }
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary text-primary group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="h-8 w-8" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-3">
        {examType.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-400 text-center leading-relaxed">
        {examType.description}
      </p>
    </div>
  )
}

export { ExamSelection }
