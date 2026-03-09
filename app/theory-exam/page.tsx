"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TheoryExamLayout } from "@/components/exam"
import type { ExamSection, QuestionNavigatorItem, TheoryQuestion } from "@/components/exam"
import { ExamProvider, useExam, formatTimeRemaining } from "@/contexts/ExamContext"
import { useUser } from "@/contexts/UserContext"
import { saveAnswer as saveAnswerApi } from "@/lib/api/exam-client"

function TheoryExamContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const examId = searchParams.get('id')
  const { user } = useUser()
  const {
    exam,
    questions,
    currentQuestionIndex,
    answers,
    isExamStarted,
    timeRemaining,
    autoSaveStatus,
    lastSavedTime,
    initializeExam,
    startExamSession,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitExam,
  } = useExam()

  const [editorValue, setEditorValue] = React.useState("")
  const [isInitializing, setIsInitializing] = React.useState(true)
  const [currentSectionId, setCurrentSectionId] = React.useState("section-b")

  // Initialize exam on mount
  React.useEffect(() => {
    async function init() {
      if (examId) {
        try {
          await initializeExam(examId)
        } catch (error) {
          console.error("Failed to initialize exam:", error)
          router.push("/exams/theory")
        }
      }
      setIsInitializing(false)
    }
    init()
  }, [examId])

  // Load current answer when question changes
  React.useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion) {
      const currentAnswer = answers.get(currentQuestion.id)
      if (currentAnswer?.answerText) {
        setEditorValue(currentAnswer.answerText)
      } else {
        setEditorValue("")
      }
    }
  }, [currentQuestionIndex, questions, answers])

  // Auto-save effect
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isExamStarted && editorValue.trim()) {
        handleAutoSave()
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearTimeout(timer)
  }, [editorValue, isExamStarted])

  const handleAutoSave = async () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion || !exam || !user) return

    try {
      await saveAnswerApi(exam.id, {
        questionId: currentQuestion.id,
        answerText: editorValue,
        isDraft: true,
      })
    } catch (error) {
      console.error("Auto-save failed:", error)
    }
  }

  const handleEditorChange = (value: string) => {
    setEditorValue(value)
  }

  const handleSaveDraft = async () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion && exam && user) {
      await saveAnswer(currentQuestion.id, {
        answerText: editorValue,
        isDraft: true,
      })
    }
  }

  const handleNext = async () => {
    // Save current answer before moving
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion && editorValue.trim()) {
      await saveAnswer(currentQuestion.id, {
        answerText: editorValue,
        isDraft: true,
      })
    }
    nextQuestion()
  }

  const handlePrevious = async () => {
    // Save current answer before moving
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion && editorValue.trim()) {
      await saveAnswer(currentQuestion.id, {
        answerText: editorValue,
        isDraft: true,
      })
    }
    previousQuestion()
  }

  const handleQuestionClick = (questionNumber: number) => {
    goToQuestion(questionNumber - 1)
  }

  const handleSubmitExam = async () => {
    const confirmed = window.confirm("Are you sure you want to submit your exam?")
    if (confirmed) {
      try {
        await submitExam()
      } catch (error) {
        console.error("Failed to submit exam:", error)
        alert("Failed to submit exam. Please try again.")
      }
    }
  }

  const handleStartExam = async () => {
    if (!isExamStarted && exam && user) {
      try {
        await startExamSession()
      } catch (error) {
        console.error("Failed to start exam:", error)
        alert("Failed to start exam. Please try again.")
      }
    }
  }

  const handleClear = () => {
    setEditorValue("")
  }

  // Show loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    )
  }

  // Show error if no exam
  if (!exam) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600">Exam not found</h2>
          <button
            onClick={() => router.push("/exams/theory")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to Exams
          </button>
        </div>
      </div>
    )
  }

  // Create sections based on exam type
  const sections: ExamSection[] = [
    {
      id: "section-a",
      name: "Section A: Objectives",
      type: "objectives",
      answeredCount: 0,
      totalCount: 0,
      progress: 0,
      status: "not-started",
    },
    {
      id: "section-b",
      name: "Section B: Theory",
      type: "theory",
      answeredCount: answers.size,
      totalCount: questions.length,
      progress: questions.length > 0 ? Math.round((answers.size / questions.length) * 100) : 0,
      status: isExamStarted ? "in-progress" : "not-started",
    },
  ]

  // Create question navigator
  const questionNavigator: QuestionNavigatorItem[] = questions.map((q, index) => ({
    number: index + 1,
    isActive: index === currentQuestionIndex,
    isAnswered: answers.has(q.id),
  }))

  const currentQuestion = questions[currentQuestionIndex]
  const question: TheoryQuestion = {
    number: currentQuestionIndex + 1,
    text: currentQuestion?.questionText || "",
    marks: currentQuestion?.marks || 10,
    suggestedWords: 250,
  }

  const wordCount = editorValue.trim() ? editorValue.trim().split(/\s+/).length : 0
  const charCount = editorValue.length

  // Show start screen before exam begins
  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-3xl font-bold text-primary mb-4">{exam.title}</h1>
          <p className="text-gray-600 mb-6">{exam.description}</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{exam.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Questions:</span>
              <span className="font-semibold">{exam.totalQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Marks:</span>
              <span className="font-semibold">{exam.totalMarks}</span>
            </div>
          </div>

          {exam.instructions && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-amber-800 mb-2">Instructions:</h3>
              <p className="text-sm text-amber-700">{exam.instructions}</p>
            </div>
          )}

          <button
            onClick={handleStartExam}
            className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors"
          >
            Start Exam
          </button>
        </div>
      </div>
    )
  }

  return (
    <TheoryExamLayout
      header={{
        title: exam.title,
        remainingTime: formatTimeRemaining(timeRemaining),
        timerVariant: "default",
        studentName: user?.name || "Student",
        studentId: user?.id || "",
      }}
      sections={sections}
      currentSectionId={currentSectionId}
      currentQuestionNumber={currentQuestionIndex + 1}
      totalQuestionsInSection={questions.length}
      question={question}
      editorValue={editorValue}
      wordCount={wordCount}
      editorCharacterCount={charCount}
      autoSaveStatus={autoSaveStatus === "saving" ? "saving" : autoSaveStatus === "saved" ? "saved" : "saved"}
      lastSavedTime={lastSavedTime?.toLocaleTimeString() || "Not saved"}
      questionNavigator={questionNavigator}
      previousDisabled={currentQuestionIndex === 0}
      onSectionChange={setCurrentSectionId}
      onQuestionClick={handleQuestionClick}
      onEditorChange={handleEditorChange}
      onClear={handleClear}
      onSaveDraft={handleSaveDraft}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onHelp={() => alert("Help requested")}
      onReportIssue={() => alert("Issue reported")}
    />
  )
}

export default function TheoryExamPage() {
  return (
    <ExamProvider>
      <TheoryExamContent />
    </ExamProvider>
  )
}
