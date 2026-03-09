"use client"

import * as React from "react"
import {
  FileText,
  PenLine,
  HelpCircle,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface ExamSection {
  id: string
  name: string
  type: "objectives" | "theory"
  answeredCount: number
  totalCount: number
  progress: number
  status: "completed" | "in-progress" | "not-started"
}

export interface QuestionNavigatorItem {
  number: number
  isActive: boolean
  isAnswered: boolean
}

export interface TheorySidebarProps {
  /** Exam sections */
  sections: ExamSection[]
  /** Current section ID */
  currentSectionId: string
  /** On section click */
  onSectionClick?: (sectionId: string) => void
  /** Question navigator items */
  questionNavigator?: QuestionNavigatorItem[]
  /** On question navigator click */
  onQuestionClick?: (questionNumber: number) => void
  /** Show help button */
  showHelp?: boolean
  /** Show report issue button */
  showReportIssue?: boolean
  /** On help click */
  onHelp?: () => void
  /** On report issue click */
  onReportIssue?: () => void
  /** Additional className */
  className?: string
}

const TheorySidebar = React.forwardRef<HTMLElement, TheorySidebarProps>(
  (
    {
      sections,
      currentSectionId,
      onSectionClick,
      questionNavigator = [],
      onQuestionClick,
      showHelp = true,
      showReportIssue = true,
      onHelp,
      onReportIssue,
      className,
    },
    ref
  ) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "w-72 flex flex-col border-r border-slate-200 bg-white dark:bg-slate-900",
          className
        )}
      >
        {/* Logo Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src="/yhs.png" alt="Yeshua High School" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Sections List */}
        <div className="flex flex-col gap-2 p-4 overflow-y-auto flex-1">
          <h3 className="px-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
            Sections
          </h3>

          {sections.map((section) => {
            const isActive = currentSectionId === section.id
            const isCompleted = section.status === "completed"

            return (
              <button
                key={section.id}
                onClick={() => onSectionClick?.(section.id)}
                className={cn(
                  "group flex flex-col gap-1 rounded-xl px-4 py-3 text-left transition-all",
                  isActive
                    ? "bg-primary/10 px-4 py-3 text-left border border-primary/20"
                    : "hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "flex items-center gap-2 text-sm font-semibold",
                      isActive ? "text-primary font-bold" : "text-slate-600"
                    )}
                  >
                    {section.type === "objectives" ? (
                      <FileText className="h-5 w-5" />
                    ) : (
                      <PenLine className="h-5 w-5" />
                    )}
                    {section.name}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {section.status === "in-progress" && !isActive && (
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      isActive ? "bg-primary" : "bg-emerald-500"
                    )}
                    style={{ width: `${section.progress}%` }}
                  />
                </div>

                {/* Status Text */}
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-tighter",
                    isActive ? "text-primary" : "text-slate-400"
                  )}
                >
                  {section.answeredCount} of {section.totalCount} Answered •{" "}
                  {section.status === "completed"
                    ? "Completed"
                    : section.status === "in-progress"
                    ? "In Progress"
                    : "Not Started"}
                </p>
              </button>
            )
          })}

          <div className="my-4 h-px bg-slate-100 dark:bg-slate-800" />

          {/* Question Navigator */}
          {questionNavigator.length > 0 && (
            <>
              <h3 className="px-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Question Navigator
              </h3>
              <div className="grid grid-cols-4 gap-2 px-2">
                {questionNavigator.map((q) => (
                  <button
                    key={q.number}
                    onClick={() => onQuestionClick?.(q.number)}
                    className={cn(
                      "flex aspect-square items-center justify-center rounded-lg text-sm font-bold transition-all",
                      q.isActive
                        ? "border-2 border-primary bg-primary text-white"
                        : q.isAnswered
                        ? "border border-slate-200 bg-emerald-50 text-emerald-600"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-primary"
                    )}
                  >
                    {q.number}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {showHelp && (
            <Button
              variant="secondary"
              className="w-full"
              onClick={onHelp}
            >
              <HelpCircle className="h-5 w-5" />
              Need Help?
            </Button>
          )}
          {showReportIssue && (
            <Button
              variant="destructive"
              className="w-full bg-red-50 text-red-600 hover:bg-red-100 shadow-none"
              onClick={onReportIssue}
            >
              Report Issue
            </Button>
          )}
        </div>
      </aside>
    )
  }
)

TheorySidebar.displayName = "TheorySidebar"

export { TheorySidebar }
