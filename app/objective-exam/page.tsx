"use client"

import * as React from "react"
import { ObjectiveExamLayout } from "@/components/exam"
import type { QuestionOption, QuestionPaletteItem } from "@/components/exam"

export default function ObjectiveExamPage() {
  const [selectedOption, setSelectedOption] = React.useState<string>("option-b")
  const [currentQuestion, setCurrentQuestion] = React.useState(14)

  const options: QuestionOption[] = [
    { id: "option-a", label: "A", text: "It is an Isosceles Triangle" },
    { id: "option-b", label: "B", text: "It is a Right-Angled Triangle" },
    { id: "option-c", label: "C", text: "It is an Equilateral Triangle" },
    { id: "option-d", label: "D", text: "It is an Obtuse Triangle" },
  ]

  const paletteQuestions: QuestionPaletteItem[] = React.useMemo(() => {
    const items: QuestionPaletteItem[] = []
    for (let i = 1; i <= 50; i++) {
      if (i < currentQuestion) {
        items.push({ number: i, status: "answered" })
      } else if (i === currentQuestion) {
        items.push({ number: i, status: "current" })
      } else {
        items.push({ number: i, status: "unvisited" })
      }
    }
    items[6].status = "not-answered"
    return items
  }, [currentQuestion])

  const summary = {
    answered: 12,
    notAnswered: 1,
    unvisited: 37,
  }

  const handleSaveAndNext = () => {
    if (currentQuestion < 50) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  return (
    <ObjectiveExamLayout
      header={{
        title: "Advanced Mathematics - Midterm 2024",
        section: "Section A: Objective Questions (MCQs)",
        remainingTime: "01:42:15",
        studentName: "Alex Thompson",
        studentId: "2024-8842",
      }}
      currentQuestion={currentQuestion}
      totalQuestions={50}
      questionText="If a triangle has sides of lengths 7, 24, and 25, which of the following statements is true regarding the type of triangle it forms?"
      options={options}
      selectedOptionId={selectedOption}
      onOptionSelect={setSelectedOption}
      paletteQuestions={paletteQuestions}
      summary={summary}
      points={2.0}
      questionType="Multiple Choice"
      previousDisabled={currentQuestion === 1}
      onPrevious={handlePrevious}
      onSaveAndNext={handleSaveAndNext}
      onPaletteQuestionClick={setCurrentQuestion}
      onSubmitExam={() => alert("Exam submitted!")}
    />
  )
}
