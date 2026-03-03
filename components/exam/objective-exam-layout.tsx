"use client"

import * as React from "react"
import { ExamHeader, ExamHeaderProps } from "./exam-header"
import { QuestionCard, QuestionCardProps, QuestionOption } from "./question-card"
import { QuestionPalette, QuestionPaletteItem } from "./question-palette"
import { QuestionNavigation } from "./question-navigation"
import { cn } from "@/lib/utils"

export interface ObjectiveExamLayoutProps {
  /** Header props */
  header: ExamHeaderProps
  /** Current question number (1-indexed) */
  currentQuestion: number
  /** Total questions */
  totalQuestions: number
  /** Question text */
  questionText: string
  /** Question options */
  options: QuestionOption[]
  /** Selected option ID */
  selectedOptionId?: string
  /** Question palette items */
  paletteQuestions: QuestionPaletteItem[]
  /** Summary counts */
  summary?: {
    answered: number
    notAnswered: number
    unvisited: number
  }
  /** Points for this question */
  points?: number
  /** Question type label */
  questionType?: string
  /** Previous button disabled */
  previousDisabled?: boolean
  /** On option select */
  onOptionSelect?: (optionId: string) => void
  /** On previous click */
  onPrevious?: () => void
  /** On save & next click */
  onSaveAndNext?: () => void
  /** On question palette click */
  onPaletteQuestionClick?: (questionNumber: number) => void
  /** On submit exam click */
  onSubmitExam?: () => void
  /** Additional className */
  className?: string
}

const ObjectiveExamLayout = React.forwardRef<HTMLDivElement, ObjectiveExamLayoutProps>(
  (
    {
      header,
      currentQuestion,
      totalQuestions,
      questionText,
      options,
      selectedOptionId,
      paletteQuestions,
      summary,
      points = 2.0,
      questionType = "Multiple Choice",
      previousDisabled = false,
      onOptionSelect,
      onPrevious,
      onSaveAndNext,
      onPaletteQuestionClick,
      onSubmitExam,
      className,
    },
    ref
  ) => {
    const progress = Math.round((currentQuestion / totalQuestions) * 100)

    return (
      <div
        ref={ref}
        className={cn(
          "bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col",
          className
        )}
      >
        {/* Header */}
        <ExamHeader {...header} />

        {/* Main Content */}
        <main className="flex flex-1 overflow-hidden h-[calc(100vh-65px)]">
          {/* Left Column: Question Area */}
          <section className="flex-1 flex flex-col overflow-y-auto p-6 lg:p-10">
            <div className="max-w-3xl mx-auto w-full">
              <QuestionCard
                questionNumber={currentQuestion}
                totalQuestions={totalQuestions}
                progress={progress}
                questionType={questionType}
                points={points}
                questionText={questionText}
                options={options}
                selectedOptionId={selectedOptionId}
                onOptionSelect={onOptionSelect}
              />

              <QuestionNavigation
                showPrevious
                showSaveAndNext
                previousDisabled={previousDisabled}
                onPrevious={onPrevious}
                onSaveAndNext={onSaveAndNext}
              />
            </div>
          </section>

          {/* Right Column: Question Palette */}
          <QuestionPalette
            questions={paletteQuestions}
            currentQuestion={currentQuestion}
            onQuestionClick={onPaletteQuestionClick}
            showLegend
            summary={summary}
            onSubmitExam={onSubmitExam}
          />
        </main>
      </div>
    )
  }
)

ObjectiveExamLayout.displayName = "ObjectiveExamLayout"

export { ObjectiveExamLayout }
