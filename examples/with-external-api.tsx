/**
 * Example: Using the External API with Exam Components
 * 
 * This file demonstrates how to integrate the external API
 * with the ObjectiveExamLayout component.
 */

"use client"

import * as React from "react"
import { ObjectiveExamLayout } from "@/components/exam"
import type { QuestionOption, QuestionPaletteItem } from "@/components/exam"
import { createApiClient, type ExamProgress, type Answer } from "@/lib/api"

// Initialize the API client
const api = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api",
  timeout: 30000,
  retries: 3,
})

interface ObjectiveExamWithApiProps {
  examId: string
  studentId: string
}

export default function ObjectiveExamWithApi({
  examId,
  studentId,
}: ObjectiveExamWithApiProps) {
  const [selectedOption, setSelectedOption] = React.useState<string>()
  const [currentQuestion, setCurrentQuestion] = React.useState(1)
  const [questions, setQuestions] = React.useState<QuestionPaletteItem[]>([])
  const [progress, setProgress] = React.useState<ExamProgress | null>(null)
  const [answers, setAnswers] = React.useState<Map<string, Answer>>(new Map())
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Load exam on mount
  React.useEffect(() => {
    async function loadExam() {
      try {
        setIsLoading(true)
        
        // Start or resume exam
        const startResult = await api.startExam({ examId, studentId })
        
        if (startResult.success && startResult.data) {
          const { exam, progress } = startResult.data
          
          // Build question palette from exam data
          const paletteItems: QuestionPaletteItem[] = exam.sections.flatMap(
            (section) =>
              section.questions.map((q, index) => ({
                number: index + 1,
                status: "unvisited" as const,
              }))
          )
          
          setQuestions(paletteItems)
          setProgress(progress)
        } else {
          setError(startResult.error?.message || "Failed to load exam")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setIsLoading(false)
      }
    }

    loadExam()
  }, [examId, studentId])

  // Update palette status based on answers
  React.useEffect(() => {
    setQuestions((prev) =>
      prev.map((q, index) => {
        const questionNum = index + 1
        if (questionNum === currentQuestion) {
          return { ...q, status: "current" }
        }
        const hasAnswer = answers.has(String(questionNum))
        return {
          ...q,
          status: hasAnswer ? "answered" : "unvisited",
        }
      })
    )
  }, [currentQuestion, answers])

  const handleSaveAndNext = async () => {
    if (!selectedOption) return

    try {
      // Save answer via API
      const result = await api.saveAnswer(examId, {
        questionId: String(currentQuestion),
        selectedOptionIds: [selectedOption],
        isDraft: false,
      })

      if (result.success && result.data) {
        // Update local answers map
        setAnswers((prev) => {
          const next = new Map(prev)
          next.set(String(currentQuestion), result.data!.answer)
          return next
        })

        // Move to next question
        if (currentQuestion < questions.length) {
          setCurrentQuestion((prev) => prev + 1)
        }
      }
    } catch (err) {
      console.error("Failed to save answer:", err)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmitExam = async () => {
    if (!confirm("Are you sure you want to submit the exam?")) return

    try {
      const allAnswers = Array.from(answers.values())
      const result = await api.submitExam({
        examId,
        studentId,
        answers: allAnswers,
      })

      if (result.success) {
        alert("Exam submitted successfully!")
      } else {
        alert("Failed to submit exam: " + result.error?.message)
      }
    } catch (err) {
      alert("Error submitting exam: " + (err instanceof Error ? err.message : "Unknown error"))
    }
  }

  if (isLoading) {
    return <div>Loading exam...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Sample options for demonstration
  const options: QuestionOption[] = [
    { id: "option-a", label: "A", text: "Option A" },
    { id: "option-b", label: "B", text: "Option B" },
    { id: "option-c", label: "C", text: "Option C" },
    { id: "option-d", label: "D", text: "Option D" },
  ]

  const summary = {
    answered: Array.from(answers.keys()).length,
    notAnswered: questions.filter((q) => q.status === "unvisited").length,
    unvisited: questions.filter((q) => q.status === "unvisited").length,
  }

  return (
    <ObjectiveExamLayout
      header={{
        title: "Exam " + examId,
        section: "Objective Questions",
        remainingTime: progress
          ? formatTime(progress.timeSpent)
          : "00:00:00",
        studentName: "Student",
        studentId: studentId,
      }}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      questionText={`Question ${currentQuestion}`}
      options={options}
      selectedOptionId={selectedOption}
      onOptionSelect={setSelectedOption}
      paletteQuestions={questions}
      summary={summary}
      previousDisabled={currentQuestion === 1}
      onPrevious={handlePrevious}
      onSaveAndNext={handleSaveAndNext}
      onPaletteQuestionClick={setCurrentQuestion}
      onSubmitExam={handleSubmitExam}
    />
  )
}

// Helper function to format time
function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}
