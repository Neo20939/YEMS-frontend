"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import {
  Exam,
  ExamQuestion,
  SavedAnswer,
  ExamProgress,
  getExamById,
  getExamQuestions,
  startExam,
  saveAnswer as saveAnswerApi,
  submitExam as submitExamApi,
  getExamProgress,
} from "@/lib/api/exam-client"
import { useUser } from "./UserContext"
import type { QuestionStatus as QuestionStatusType } from "@/components/exam/question-palette"

interface QuestionStatusLocal {
  questionNumber: number
  status: QuestionStatusType
}

interface ExamState {
  exam: Exam | null
  questions: ExamQuestion[]
  currentQuestionIndex: number
  answers: Map<string, SavedAnswer>
  questionStatuses: QuestionStatusLocal[]
  isExamStarted: boolean
  isSubmitting: boolean
  timeRemaining: number // in seconds
  autoSaveStatus: "idle" | "saving" | "saved" | "error"
  lastSavedTime: Date | null
}

interface ExamContextType extends ExamState {
  // Exam lifecycle
  initializeExam: (examId: string) => Promise<void>
  startExamSession: () => Promise<void>
  submitExam: () => Promise<void>
  
  // Navigation
  goToQuestion: (index: number) => void
  nextQuestion: () => void
  previousQuestion: () => void
  
  // Answer management
  saveAnswer: (questionId: string, answerData: Partial<SavedAnswer>) => Promise<void>
  saveCurrentAnswer: () => Promise<void>
  flagCurrentQuestion: () => void
  
  // Timer
  resetTimer: () => void
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

const INITIAL_STATE: ExamState = {
  exam: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: new Map(),
  questionStatuses: [],
  isExamStarted: false,
  isSubmitting: false,
  timeRemaining: 0,
  autoSaveStatus: "idle",
  lastSavedTime: null,
}

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ExamState>(INITIAL_STATE)
  const { user } = useUser()
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current)
    }
  }, [])

  // Timer effect
  useEffect(() => {
    if (state.isExamStarted && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (prev.timeRemaining <= 1) {
            // Time's up - auto submit
            handleAutoSubmit()
            return { ...prev, timeRemaining: 0 }
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 }
        })
      }, 1000)

      return () => {
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }
  }, [state.isExamStarted, state.timeRemaining])

  // Auto-save effect (every 30 seconds)
  useEffect(() => {
    if (state.isExamStarted && state.exam) {
      autoSaveTimerRef.current = setInterval(() => {
        // Auto-save current answer if it's a draft
        const currentQuestion = state.questions[state.currentQuestionIndex]
        if (currentQuestion) {
          const currentAnswer = state.answers.get(currentQuestion.id)
          if (currentAnswer?.isDraft) {
            saveCurrentAnswerInternal()
          }
        }
      }, 30000) // 30 seconds

      return () => {
        if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [state.isExamStarted, state.exam, state.currentQuestionIndex, state.answers])

  const handleAutoSubmit = useCallback(async () => {
    if (!state.exam || !user) return
    
    try {
      await submitExamApi(state.exam.id)
      setState((prev) => ({ ...prev, isSubmitting: false, isExamStarted: false }))
      
      // Redirect to results page or dashboard
      window.location.href = `/exams/results?examId=${state.exam.id}`
    } catch (error) {
      console.error("Auto-submit failed:", error)
    }
  }, [state.exam, state.answers, user])

  const initializeExam = useCallback(async (examId: string) => {
    setState((prev) => ({ ...prev, exam: null, questions: [] }))
    
    try {
      // Fetch exam details
      const exam = await getExamById(examId)
      if (!exam) {
        throw new Error("Exam not found")
      }

      // Fetch questions
      const questions = await getExamQuestions(examId)

      // Initialize question statuses
      const statuses: QuestionStatusLocal[] = questions.map((q, index) => ({
        questionNumber: index + 1,
        status: "unvisited",
      }))

      // Check for existing progress
      if (user) {
        const progress = await getExamProgress(examId)
        if (progress && progress.answers) {
          // Load existing answers
          const answersMap = new Map<string, SavedAnswer>()
          progress.answers.forEach((answer) => {
            answersMap.set(answer.questionId, answer)
          })

          // Update question statuses based on answers
          statuses.forEach((status, index) => {
            const question = questions[index]
            if (question && answersMap.has(question.id)) {
              status.status = "answered"
            }
          })

          setState((prev) => ({
            ...prev,
            answers: answersMap,
            questionStatuses: statuses,
          }))
        }
      }

      setState((prev) => ({
        ...prev,
        exam,
        questions,
        questionStatuses: statuses,
        timeRemaining: exam.duration * 60, // Convert minutes to seconds
      }))
    } catch (error) {
      console.error("Failed to initialize exam:", error)
      throw error
    }
  }, [user])

  const startExamSession = useCallback(async () => {
    if (!state.exam || !user) return

    try {
      await startExam(state.exam.id, user.id)
      setState((prev) => ({
        ...prev,
        isExamStarted: true,
        questionStatuses: prev.questionStatuses.map((qs, index) =>
          index === 0 ? { ...qs, status: "visited" } : qs
        ),
      }))
    } catch (error) {
      console.error("Failed to start exam:", error)
      throw error
    }
  }, [state.exam, user])

  const submitExam = useCallback(async () => {
    if (!state.exam || !user || state.isSubmitting) return

    setState((prev) => ({ ...prev, isSubmitting: true }))

    try {
      await submitExamApi(state.exam.id)
      
      setState((prev) => ({ ...prev, isSubmitting: false, isExamStarted: false }))
      
      // Redirect to results page
      window.location.href = `/exams/results?examId=${state.exam.id}`
    } catch (error) {
      console.error("Failed to submit exam:", error)
      setState((prev) => ({ ...prev, isSubmitting: false }))
      throw error
    }
  }, [state.exam, state.answers, state.isSubmitting, user])

  const goToQuestion = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: index,
      questionStatuses: prev.questionStatuses.map((qs, i) =>
        i === index && qs.status === "visited" ? qs : qs
      ),
    }))
  }, [])

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex >= prev.questions.length - 1) return prev
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        questionStatuses: prev.questionStatuses.map((qs, i) =>
          i === prev.currentQuestionIndex + 1 && qs.status === "unvisited"
            ? { ...qs, status: "visited" }
            : qs
        ),
      }
    })
  }, [])

  const previousQuestion = useCallback(() => {
    setState((prev) => {
      if (prev.currentQuestionIndex <= 0) return prev
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }
    })
  }, [])

  const saveCurrentAnswerInternal = useCallback(async () => {
    const currentQuestion = state.questions[state.currentQuestionIndex]
    const currentAnswer = state.answers.get(currentQuestion?.id || "")
    
    if (!currentQuestion || !currentAnswer || !currentAnswer.isDraft) return

    try {
      setState((prev) => ({ ...prev, autoSaveStatus: "saving" }))
      await saveAnswerApi(state.exam!.id, {
        questionId: currentQuestion.id,
        answerText: currentAnswer.answerText,
        selectedOptionIds: currentAnswer.selectedOptionIds,
        isDraft: true,
      })
      setState((prev) => ({
        ...prev,
        autoSaveStatus: "saved",
        lastSavedTime: new Date(),
      }))
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, autoSaveStatus: "idle" }))
      }, 2000)
    } catch (error) {
      console.error("Auto-save failed:", error)
      setState((prev) => ({ ...prev, autoSaveStatus: "error" }))
    }
  }, [state.questions, state.currentQuestionIndex, state.answers, state.exam])

  const saveAnswer = useCallback(async (
    questionId: string,
    answerData: Partial<SavedAnswer>
  ) => {
    if (!state.exam || !user) return

    try {
      setState((prev) => ({ ...prev, autoSaveStatus: "saving" }))
      
      const savedAnswer = await saveAnswerApi(state.exam.id, {
        questionId,
        ...answerData,
      } as any)

      setState((prev) => {
        const newAnswers = new Map(prev.answers)
        newAnswers.set(questionId, savedAnswer)

        // Update question status
        const newStatuses = [...prev.questionStatuses]
        const questionIndex = prev.questions.findIndex((q) => q.id === questionId)
        if (questionIndex !== -1) {
          newStatuses[questionIndex] = {
            ...newStatuses[questionIndex],
            status: answerData.isDraft ? "not-answered" : "answered",
          }
        }

        return {
          ...prev,
          answers: newAnswers,
          questionStatuses: newStatuses,
          autoSaveStatus: "saved",
          lastSavedTime: new Date(),
        }
      })

      // Reset status after 2 seconds
      setTimeout(() => {
        setState((prev) => ({ ...prev, autoSaveStatus: "idle" }))
      }, 2000)
    } catch (error) {
      console.error("Failed to save answer:", error)
      setState((prev) => ({ ...prev, autoSaveStatus: "error" }))
      throw error
    }
  }, [state.exam, state.questions, user])

  const saveCurrentAnswer = useCallback(async () => {
    const currentQuestion = state.questions[state.currentQuestionIndex]
    if (!currentQuestion) return

    const currentAnswer = state.answers.get(currentQuestion.id)
    if (!currentAnswer) return

    await saveAnswer(currentQuestion.id, {
      answerText: currentAnswer.answerText,
      selectedOptionIds: currentAnswer.selectedOptionIds,
      isDraft: false,
    })
  }, [state.questions, state.currentQuestionIndex, state.answers, saveAnswer])

  const flagCurrentQuestion = useCallback(async () => {
    const currentQuestion = state.questions[state.currentQuestionIndex]
    if (!currentQuestion) return

    const currentAnswer = state.answers.get(currentQuestion.id)
    
    await saveAnswer(currentQuestion.id, {
      answerText: currentAnswer?.answerText,
      selectedOptionIds: currentAnswer?.selectedOptionIds,
      isDraft: currentAnswer?.isDraft ?? true,
      isFlagged: !(currentAnswer?.isFlagged ?? false),
    })
  }, [state.questions, state.currentQuestionIndex, state.answers, saveAnswer])

  const resetTimer = useCallback(() => {
    if (state.exam) {
      setState((prev) => ({ ...prev, timeRemaining: state.exam!.duration * 60 }))
    }
  }, [state.exam])

  const value: ExamContextType = {
    ...state,
    initializeExam,
    startExamSession,
    submitExam,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    saveAnswer,
    saveCurrentAnswer,
    flagCurrentQuestion,
    resetTimer,
  }

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>
}

export function useExam() {
  const context = useContext(ExamContext)
  if (context === undefined) {
    throw new Error("useExam must be used within an ExamProvider")
  }
  return context
}

// Helper function to format time remaining
export function formatTimeRemaining(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}
