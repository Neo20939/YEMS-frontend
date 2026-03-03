"use client"

import * as React from "react"
import { ExamHeader, ExamHeaderProps } from "./exam-header"
import { TheorySidebar, ExamSection, QuestionNavigatorItem } from "./theory-sidebar"
import { TextEditor } from "./text-editor"
import { StickyActionBar } from "./sticky-action-bar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export interface TheoryQuestion {
  /** Question number */
  number: number
  /** Question text */
  text: string
  /** Marks for this question */
  marks: number
  /** Suggested word count */
  suggestedWords?: number
}

export interface TheoryExamLayoutProps {
  /** Header props (without section - managed internally) */
  header: Omit<ExamHeaderProps, "section">
  /** Exam sections */
  sections: ExamSection[]
  /** Current section ID */
  currentSectionId: string
  /** Current question number within section */
  currentQuestionNumber: number
  /** Total questions in current section */
  totalQuestionsInSection: number
  /** Current question data */
  question: TheoryQuestion
  /** Editor value */
  editorValue?: string
  /** Editor word count */
  wordCount?: number
  /** Editor character count */
  editorCharacterCount?: number
  /** Auto-save status */
  autoSaveStatus?: "saving" | "saved" | "error"
  /** Last saved time */
  lastSavedTime?: string
  /** Question navigator items */
  questionNavigator?: QuestionNavigatorItem[]
  /** Previous button disabled */
  previousDisabled?: boolean
  /** On section change */
  onSectionChange?: (sectionId: string) => void
  /** On question navigator click */
  onQuestionClick?: (questionNumber: number) => void
  /** On editor change */
  onEditorChange?: (value: string) => void
  /** On clear response */
  onClear?: () => void
  /** On save draft */
  onSaveDraft?: () => void
  /** On previous */
  onPrevious?: () => void
  /** On next */
  onNext?: () => void
  /** On help */
  onHelp?: () => void
  /** On report issue */
  onReportIssue?: () => void
  /** Additional className */
  className?: string
}

const TheoryExamLayout = React.forwardRef<HTMLDivElement, TheoryExamLayoutProps>(
  (
    {
      header,
      sections,
      currentSectionId,
      currentQuestionNumber,
      totalQuestionsInSection,
      question,
      editorValue = "",
      wordCount = 0,
      editorCharacterCount = 0,
      autoSaveStatus = "saved",
      lastSavedTime,
      questionNavigator = [],
      previousDisabled = false,
      onSectionChange,
      onQuestionClick,
      onEditorChange,
      onClear,
      onSaveDraft,
      onPrevious,
      onNext,
      onHelp,
      onReportIssue,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark",
          className
        )}
      >
        {/* Header */}
        <ExamHeader
          {...header}
          section={`Section: ${sections.find((s) => s.id === currentSectionId)?.name || ""}`}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <TheorySidebar
            sections={sections}
            currentSectionId={currentSectionId}
            onSectionClick={onSectionChange}
            questionNavigator={questionNavigator}
            onQuestionClick={onQuestionClick}
            showHelp
            showReportIssue
            onHelp={onHelp}
            onReportIssue={onReportIssue}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto relative">
            {/* Question Section */}
            <div className="mx-auto w-full max-w-4xl p-8 pb-32">
              {/* Breadcrumb */}
              <div className="mb-6 flex items-center justify-between">
                <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <span>Section B</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-primary">
                    Question {currentQuestionNumber} of {totalQuestionsInSection}
                  </span>
                </nav>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {question.marks} Marks
                </div>
              </div>

              {/* Question Card */}
              <div className="mb-8 rounded-xl bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                  {question.text}
                </h1>
                {question.suggestedWords && (
                  <div className="mt-4 flex items-center gap-4 text-sm text-slate-500 italic">
                    <span className="flex items-center gap-1">
                      Minimum {question.suggestedWords} words suggested
                    </span>
                  </div>
                )}
              </div>

              {/* Editor */}
              <TextEditor
                value={editorValue}
                onChange={onEditorChange}
                wordCount={wordCount}
                characterCount={editorCharacterCount}
                autoSaveStatus={autoSaveStatus}
                lastSavedTime={lastSavedTime}
                showWordCount
                showCharacterCount
                showAutoSave
                showToolbar
              />
            </div>

            {/* Sticky Action Bar */}
            <StickyActionBar
              showPrevious
              showNext
              showClear
              showSaveDraft
              previousDisabled={previousDisabled}
              sidebarOffset={288} /* 72 * 4 = 288px (w-72 sidebar) */
              nextText="Next Question"
              onPrevious={onPrevious}
              onNext={onNext}
              onClear={onClear}
              onSaveDraft={onSaveDraft}
            />
          </main>
        </div>
      </div>
    )
  }
)

TheoryExamLayout.displayName = "TheoryExamLayout"

export { TheoryExamLayout }
