// Common types for the YEMS frontend

export interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher" | "admin"
  avatar?: string
}

export interface Student extends User {
  role: "student"
  studentId: string
  grade?: string
}

export interface Teacher extends User {
  role: "teacher"
  teacherId: string
  department?: string
}

export interface Assignment {
  id: string
  title: string
  description: string
  subject: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number
}

export interface Exam {
  id: string
  title: string
  subject: string
  date: string
  duration: number
  type: "midterm" | "examination"
  status: "scheduled" | "ongoing" | "completed"
}

export interface Note {
  id: string
  title: string
  subject: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface LiveLesson {
  id: string
  subject: string
  topic: string
  time: string
  instructor: string
  joinUrl?: string
}
