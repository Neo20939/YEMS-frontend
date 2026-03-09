"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ObjectiveExamLayout } from "@/components/exam"
import type { QuestionOption, QuestionPaletteItem } from "@/components/exam"
import { ExamProvider, useExam, formatTimeRemaining } from "@/contexts/ExamContext"
import { useUser } from "@/contexts/UserContext"

function ObjectiveExamContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const examId = searchParams.get('id')
  const { user } = useUser()
  const {
    exam,
    questions,
    currentQuestionIndex,
    answers,
    questionStatuses,
    isExamStarted,
    timeRemaining,
    initializeExam,
    startExamSession,
    saveAnswer,
    saveCurrentAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitExam,
  } = useExam()

  const [selectedOptionId, setSelectedOptionId] = React.useState<string>("")
  const [isInitializing, setIsInitializing] = React.useState(true)

  // Initialize exam on mount
  React.useEffect(() => {
    async function init() {
      if (examId) {
        try {
          await initializeExam(examId)
        } catch (error) {
          console.error("Failed to initialize exam:", error)
          router.push("/exams/objective")
        }
      }
      setIsInitializing(false)
    }
    init()
  }, [examId])

  // Update selected option when current question changes
  React.useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion) {
      const currentAnswer = answers.get(currentQuestion.id)
      if (currentAnswer?.selectedOptionIds?.[0]) {
        setSelectedOptionId(currentAnswer.selectedOptionIds[0])
      } else {
        setSelectedOptionId("")
      }
    }
  }, [currentQuestionIndex, questions, answers])

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionId(optionId)
  }

  const handleSaveAndNext = async () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (currentQuestion && selectedOptionId) {
      await saveAnswer(currentQuestion.id, {
        selectedOptionIds: [selectedOptionId],
        isDraft: false,
      })
    }
    nextQuestion()
  }

  const handlePrevious = () => {
    previousQuestion()
  }

  const handlePaletteClick = (questionNumber: number) => {
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
            onClick={() => router.push("/exams/objective")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to Exams
          </button>
        </div>
      </div>
    )
  }

  // Convert question statuses for the palette
  const paletteQuestions: QuestionPaletteItem[] = questionStatuses.map((qs) => ({
    number: qs.questionNumber,
    status: qs.status,
  }))

  // Calculate summary
  const summary = {
    answered: questionStatuses.filter((qs) => qs.status === "answered").length,
    notAnswered: questionStatuses.filter((qs) => qs.status === "not-answered").length,
    unvisited: questionStatuses.filter((qs) => qs.status === "unvisited").length,
  }

  const currentQuestion = questions[currentQuestionIndex]
  const options: QuestionOption[] = currentQuestion?.options?.map((opt) => ({
    id: opt.id,
    label: opt.id.replace("option-", "").toUpperCase(),
    text: opt.text,
  })) || []

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
    <ObjectiveExamLayout
      header={{
        title: exam.title,
        section: "Section A: Objective Questions (MCQs)",
        remainingTime: formatTimeRemaining(timeRemaining),
        studentName: user?.name || "Student",
        studentId: user?.id || "",
      }}
      currentQuestion={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      questionText={currentQuestion?.questionText || ""}
      options={options}
      selectedOptionId={selectedOptionId}
      onOptionSelect={handleOptionSelect}
      paletteQuestions={paletteQuestions}
      summary={summary}
      points={currentQuestion?.marks || 1}
      questionType="Multiple Choice"
      previousDisabled={currentQuestionIndex === 0}
      onPrevious={handlePrevious}
      onSaveAndNext={handleSaveAndNext}
      onPaletteQuestionClick={handlePaletteClick}
      onSubmitExam={handleSubmitExam}
    />
  )
}

export default function ObjectiveExamPage() {
  return (
    <ExamProvider>
      <ObjectiveExamContent />
    </ExamProvider>
  )
}
