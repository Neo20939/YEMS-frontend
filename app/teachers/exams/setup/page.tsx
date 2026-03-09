"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { TeacherSidebar } from "@/components/teachers/TeacherSidebar"
import TeacherHeader from "@/components/teachers/TeacherHeader"
import { useUser } from "@/contexts/UserContext"
import { getExams, createQuestion, type Exam } from "@/lib/api/exam-client"
import { cn } from "@/lib/utils"

type QuestionType = 'multiple-choice' | 'single-choice' | 'essay' | 'short-answer'
type Difficulty = 'easy' | 'medium' | 'hard'

interface Option {
  id: string
  label: string
  text: string
  isCorrect?: boolean
}

export default function ExamSetupPage() {
  const router = useRouter()
  const { user } = useUser()
  const [exams, setExams] = React.useState<Exam[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [selectedExam, setSelectedExam] = React.useState<string>('')
  
  // Question form state
  const [questionType, setQuestionType] = React.useState<QuestionType>('multiple-choice')
  const [questionText, setQuestionText] = React.useState('')
  const [marks, setMarks] = React.useState(1)
  const [order, setOrder] = React.useState(1)
  const [difficulty, setDifficulty] = React.useState<Difficulty>('medium')
  const [topic, setTopic] = React.useState('')
  const [tags, setTags] = React.useState('')
  const [options, setOptions] = React.useState<Option[]>([
    { id: 'option-a', label: 'A', text: '', isCorrect: false },
    { id: 'option-b', label: 'B', text: '', isCorrect: false },
    { id: 'option-c', label: 'C', text: '', isCorrect: false },
    { id: 'option-d', label: 'D', text: '', isCorrect: false },
  ])
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  React.useEffect(() => {
    async function loadExams() {
      setIsLoading(true)
      try {
        const apiExams = await getExams()
        setExams(apiExams)
        if (apiExams.length > 0) {
          setSelectedExam(apiExams[0].id)
        }
      } catch (error) {
        console.error('Failed to load exams:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadExams()
  }, [])

  const handleAddOption = () => {
    const newOption: Option = {
      id: `option-${String.fromCharCode(97 + options.length)}`,
      label: String.fromCharCode(65 + options.length),
      text: '',
      isCorrect: false,
    }
    setOptions([...options, newOption])
  }

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...options]
    newOptions[index].text = text
    setOptions(newOptions)
  }

  const handleCorrectOptionChange = (index: number) => {
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }))
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedExam || !questionText.trim()) {
      alert('Please select an exam and enter question text')
      return
    }

    if ((questionType === 'multiple-choice' || questionType === 'single-choice') && 
        !options.some(opt => opt.isCorrect)) {
      alert('Please select the correct answer')
      return
    }

    setIsSubmitting(true)
    setSuccess(false)

    try {
      await createQuestion(selectedExam, {
        sectionId: 'section-b',
        type: questionType,
        text: questionText,
        order,
        marks,
        options: questionType === 'multiple-choice' || questionType === 'single-choice' 
          ? options.map(({ id, label, text }) => ({ id, label, text }))
          : undefined,
        metadata: {
          difficulty,
          topic: topic || undefined,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        },
      })

      setSuccess(true)
      // Reset form
      setQuestionText('')
      setOptions([
        { id: 'option-a', label: 'A', text: '', isCorrect: false },
        { id: 'option-b', label: 'B', text: '', isCorrect: false },
        { id: 'option-c', label: 'C', text: '', isCorrect: false },
        { id: 'option-d', label: 'D', text: '', isCorrect: false },
      ])
      setOrder(order + 1)
    } catch (error: any) {
      console.error('Failed to create question:', error)
      alert(error.message || 'Failed to create question')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <TeacherSidebar />
      <div className="ml-20 transition-all duration-300">
        <TeacherHeader />
        
        <main className="py-8 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Exam Question</h1>
              <p className="text-slate-500">Add new questions to your exams</p>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-700">
                  <span className="material-symbols-outlined">check_circle</span>
                  <p className="font-semibold">Question created successfully!</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Select Exam */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Select Exam
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => setSelectedExam(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {exams.map((exam) => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title} ({exam.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Type */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Question Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'multiple-choice', label: 'Multiple Choice', icon: 'radio_button_checked' },
                    { value: 'single-choice', label: 'Single Choice', icon: 'radio_button_unchecked' },
                    { value: 'essay', label: 'Essay', icon: 'edit_note' },
                    { value: 'short-answer', label: 'Short Answer', icon: 'short_text' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setQuestionType(type.value as QuestionType)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-center",
                        questionType === type.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 hover:border-slate-300"
                      )}
                    >
                      <span className="material-symbols-outlined text-2xl mb-2">{type.icon}</span>
                      <p className="text-xs font-semibold">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Question Text
                </label>
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter your question here..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  required
                />
              </div>

              {/* Options (for MCQs) */}
              {(questionType === 'multiple-choice' || questionType === 'single-choice') && (
                <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-slate-700">
                      Answer Options
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-sm text-primary font-semibold hover:text-primary-dark flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      Add Option
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={option.isCorrect || false}
                          onChange={() => handleCorrectOptionChange(index)}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                          {option.label}
                        </span>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionTextChange(index, e.target.value)}
                          placeholder={`Option ${option.label}`}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                        {options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(index)}
                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Select the radio button next to the correct answer
                  </p>
                </div>
              )}

              {/* Question Settings */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Question Settings
                </label>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Marks</label>
                    <input
                      type="number"
                      min="1"
                      value={marks}
                      onChange={(e) => setMarks(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Order</label>
                    <input
                      type="number"
                      min="1"
                      value={order}
                      onChange={(e) => setOrder(parseInt(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1.5">Topic</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Algebra"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-500 mb-1.5">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., midterm, chapter1, important"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      Creating Question...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">add_circle</span>
                      Create Question
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
