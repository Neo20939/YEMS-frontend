"use client"

import * as React from "react"
import { TheoryExamLayout } from "@/components/exam"
import type { ExamSection, QuestionNavigatorItem, TheoryQuestion } from "@/components/exam"

export default function TheoryExamPage() {
  const [editorValue, setEditorValue] = React.useState("")
  const [currentSection, setCurrentSection] = React.useState("section-b")
  const [currentQuestion, setCurrentQuestion] = React.useState(1)

  const sections: ExamSection[] = [
    {
      id: "section-a",
      name: "Section A: Objectives",
      type: "objectives",
      answeredCount: 20,
      totalCount: 20,
      progress: 100,
      status: "completed",
    },
    {
      id: "section-b",
      name: "Section B: Theory",
      type: "theory",
      answeredCount: 1,
      totalCount: 5,
      progress: 20,
      status: "in-progress",
    },
  ]

  const questionNavigator: QuestionNavigatorItem[] = [
    { number: 1, isActive: currentQuestion === 1, isAnswered: true },
    { number: 2, isActive: currentQuestion === 2, isAnswered: false },
    { number: 3, isActive: currentQuestion === 3, isAnswered: false },
    { number: 4, isActive: currentQuestion === 4, isAnswered: false },
    { number: 5, isActive: currentQuestion === 5, isAnswered: false },
  ]

  const question: TheoryQuestion = {
    number: currentQuestion,
    text: "Explain the difference between synchronous and asynchronous data transmission. Provide real-world examples for each to illustrate your answer.",
    marks: 10,
    suggestedWords: 250,
  }

  const wordCount = editorValue.trim() ? editorValue.trim().split(/\s+/).length : 0
  const charCount = editorValue.length

  return (
    <TheoryExamLayout
      header={{
        title: "Final Term: Computer Science",
        remainingTime: "45:12 Remaining",
        timerVariant: "default",
        studentName: "Alex Johnson",
        studentId: "20210459",
      }}
      sections={sections}
      currentSectionId={currentSection}
      currentQuestionNumber={currentQuestion}
      totalQuestionsInSection={5}
      question={question}
      editorValue={editorValue}
      wordCount={wordCount}
      editorCharacterCount={charCount}
      autoSaveStatus="saved"
      lastSavedTime="10:45 AM"
      questionNavigator={questionNavigator}
      previousDisabled={currentQuestion === 1}
      onSectionChange={setCurrentSection}
      onQuestionClick={setCurrentQuestion}
      onEditorChange={setEditorValue}
      onClear={() => setEditorValue("")}
      onSaveDraft={() => alert("Draft saved!")}
      onPrevious={() => currentQuestion > 1 && setCurrentQuestion((p) => p - 1)}
      onNext={() => currentQuestion < 5 && setCurrentQuestion((p) => p + 1)}
      onHelp={() => alert("Help requested")}
      onReportIssue={() => alert("Issue reported")}
    />
  )
}
