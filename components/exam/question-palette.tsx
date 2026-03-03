"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type QuestionStatus = "answered" | "not-answered" | "unvisited" | "current"

export interface QuestionPaletteItem {
  number: number
  status: QuestionStatus
}

export interface QuestionPaletteProps {
  /** All question items */
  questions: QuestionPaletteItem[]
  /** Current question number */
  currentQuestion: number
  /** On question click */
  onQuestionClick?: (questionNumber: number) => void
  /** Show legend */
  showLegend?: boolean
  /** Summary counts */
  summary?: {
    answered: number
    notAnswered: number
    unvisited: number
  }
  /** On submit exam click */
  onSubmitExam?: () => void
  /** Submit button text */
  submitButtonText?: string
  /** Additional className */
  className?: string
}

const statusClasses: Record<QuestionStatus, string> = {
  answered: "bg-emerald-500 text-white hover:bg-emerald-600",
  "not-answered": "bg-orange-500 text-white hover:bg-orange-600",
  unvisited: "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600",
  current: "border-2 border-primary text-primary font-bold bg-white dark:bg-slate-900 hover:bg-primary/5",
}

const QuestionPalette = React.forwardRef<HTMLDivElement, QuestionPaletteProps>(
  (
    {
      questions,
      currentQuestion,
      onQuestionClick,
      showLegend = true,
      summary,
      onSubmitExam,
      submitButtonText = "Submit Exam",
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col",
          className
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-1">
            Question Palette
          </h3>
          <p className="text-xs text-slate-500">Quickly jump to any question</p>
        </div>

        {/* Question Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q) => (
              <button
                key={q.number}
                onClick={() => onQuestionClick?.(q.number)}
                className={cn(
                  "w-9 h-9 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200",
                  statusClasses[q.status]
                )}
              >
                {q.number}
              </button>
            ))}
          </div>
        </div>

        {/* Legend & Summary */}
        {showLegend && summary && (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-4">
              Summary
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-sm bg-emerald-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Answered ({summary.answered})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-sm bg-orange-500" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Not Answered ({summary.notAnswered})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Unvisited ({summary.unvisited})
                </span>
              </div>
            </div>

            {onSubmitExam && (
              <button
                onClick={onSubmitExam}
                className="w-full mt-6 py-3 rounded-lg bg-slate-900 dark:bg-primary text-white font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {submitButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    )
  }
)

QuestionPalette.displayName = "QuestionPalette"

export { QuestionPalette }
