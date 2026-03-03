"use client"

import * as React from "react"
import { TheoryExamLayout } from "@/components/exam"
import type { ExamSection, QuestionNavigatorItem, TheoryQuestion } from "@/components/exam"

export default function TheoryExamExample() {
  const [editorValue, setEditorValue] = React.useState("")
  const [currentSection, setCurrentSection] = React.useState("section-b")
  const [currentQuestion, setCurrentQuestion] = React.useState(1)

  // Sample sections
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

  // Question navigator
  const questionNavigator: QuestionNavigatorItem[] = [
    { number: 1, isActive: currentQuestion === 1, isAnswered: true },
    { number: 2, isActive: currentQuestion === 2, isAnswered: false },
    { number: 3, isActive: currentQuestion === 3, isAnswered: false },
    { number: 4, isActive: currentQuestion === 4, isAnswered: false },
    { number: 5, isActive: currentQuestion === 5, isAnswered: false },
  ]

  // Current question data
  const question: TheoryQuestion = {
    number: currentQuestion,
    text: "Explain the difference between synchronous and asynchronous data transmission. Provide real-world examples for each to illustrate your answer.",
    marks: 10,
    suggestedWords: 250,
  }

  // Calculate word and character count
  const wordCount = editorValue.trim() ? editorValue.trim().split(/\s+/).length : 0
  const charCount = editorValue.length

  const handleNext = () => {
    if (currentQuestion < 5) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleQuestionClick = (num: number) => {
    setCurrentQuestion(num)
  }

  return (
    <TheoryExamLayout
      header={{
        title: "Final Term: Computer Science",
        remainingTime: "45:12 Remaining",
        timerVariant: "default",
        studentName: "Alex Johnson",
        studentId: "20210459",
        profileImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsYH6eLGGq22d4uyZimxRLMwabYLF-DvIvy80we9TFLGWsnZxliJ1JhjhGnWV-yGO2QB9SfXi1VjnY1FNwa1GNohCEAsvuEK8oy7QMHX8auWl-HN17Ie47dpThv3eTJ4UkmkixVhuxvM8Z5k4roNPnzlwUaqLPZlYrjKpctzMQDsb1sdFi7maqDcU95OtEXqHCRrQyEVYRZaZA3WmVD3CYYmEW9GqKT84mC5MnXwV6DGyIXCQC71p_CvITLJNdVltCM2Xy6QQW0KAb",
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
      onQuestionClick={handleQuestionClick}
      onEditorChange={setEditorValue}
      onClear={() => setEditorValue("")}
      onSaveDraft={() => console.log("Draft saved")}
      onPrevious={handlePrevious}
      onNext={handleNext}
      onHelp={() => console.log("Help clicked")}
      onReportIssue={() => console.log("Report issue clicked")}
    />
  )
}
