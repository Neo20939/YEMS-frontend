"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface QuestionOption {
  id: string
  label: string
  text: string
}

export interface QuestionCardProps {
  /** Question number (e.g., 14) */
  questionNumber: number
  /** Total questions (e.g., 50) */
  totalQuestions: number
  /** Progress percentage (0-100) */
  progress: number
  /** Question type label (e.g., "Multiple Choice") */
  questionType?: string
  /** Points for this question */
  points?: number
  /** Question text */
  questionText: string
  /** Answer options */
  options: QuestionOption[]
  /** Selected option ID */
  selectedOptionId?: string
  /** On option select */
  onOptionSelect?: (optionId: string) => void
  /** Additional className */
  className?: string
}

const QuestionCard = React.forwardRef<HTMLDivElement, QuestionCardProps>(
  (
    {
      questionNumber,
      totalQuestions,
      progress,
      questionType = "Multiple Choice",
      points,
      questionText,
      options,
      selectedOptionId,
      onOptionSelect,
      className,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn("space-y-8", className)}>
        {/* Progress Header */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-sm font-bold text-primary">
              {progress}% Complete
            </span>
          </div>
          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          {/* Card Header */}
          <div className="flex items-start justify-between mb-6">
            <span className="bg-primary/10 text-primary/90 text-xs font-bold px-3 py-1 rounded-full uppercase">
              {questionType}
            </span>
            {points !== undefined && (
              <span className="text-slate-400 text-sm font-medium">
                Points: {points.toFixed(1)}
              </span>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-xl font-medium leading-relaxed text-slate-700 dark:text-slate-200 mb-10">
            {questionText}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option) => {
              const isSelected = selectedOptionId === option.id
              return (
                <label
                  key={option.id}
                  className={cn(
                    "group flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200",
                    isSelected
                      ? "border-primary/70 bg-primary/5"
                      : "border-slate-100/60 dark:border-slate-800/60 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <input
                    type="radio"
                    name="exam-option"
                    checked={isSelected}
                    onChange={() => onOptionSelect?.(option.id)}
                    className="size-5 text-primary focus:ring-primary border-slate-300 dark:border-slate-700 bg-transparent"
                  />
                  <span
                    className={cn(
                      "ml-4 font-medium",
                      isSelected
                        ? "text-primary/90 font-bold"
                        : "text-slate-600 dark:text-slate-300"
                    )}
                  >
                    <span className="font-bold mr-2">{option.label}.</span>
                    {option.text}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
)

QuestionCard.displayName = "QuestionCard"

export { QuestionCard }
