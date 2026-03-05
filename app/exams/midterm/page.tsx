"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Calculator, Atom, BookOpen, FlaskConical, Globe, PenTool } from "lucide-react"
import Sidebar from "@/components/layout/Sidebar"
import DashboardHeader from "@/components/layout/DashboardHeader"
import { MidtermListing } from "@/components/exam/midterm-listing"
import type { MidtermCard } from "@/components/exam/midterm-listing"

export default function MidTermExamsPage() {
  const router = useRouter()

  const midterms: MidtermCard[] = [
    {
      id: "mathematics",
      title: "Mathematics 101",
      description: "Algebra, Calculus & Geometry fundamentals.",
      duration: 60,
      questions: 40,
      iconType: "math",
      status: "not-started",
      route: "/objective-exam",
    },
    {
      id: "physics",
      title: "Advanced Physics",
      description: "Quantum mechanics and Thermodynamics.",
      duration: 90,
      questions: 50,
      iconType: "science",
      status: "upcoming",
      route: "/objective-exam",
    },
    {
      id: "english",
      title: "English Lit.",
      description: "Analysis of 19th-century classic literature.",
      duration: 45,
      questions: 30,
      iconType: "english",
      status: "new",
      route: "/objective-exam",
    },
    {
      id: "philosophy",
      title: "Philosophy 101",
      description: "Introduction to logic and ethical frameworks.",
      duration: 60,
      questions: 40,
      iconType: "philosophy",
      status: "not-started",
      route: "/objective-exam",
    },
    {
      id: "history",
      title: "World History",
      description: "Significant events of the 20th century.",
      duration: 50,
      questions: 35,
      iconType: "history",
      status: "not-started",
      route: "/objective-exam",
    },
    {
      id: "chemistry",
      title: "Chemistry",
      description: "Atomic structure, bonding & reactions.",
      duration: 75,
      questions: 45,
      iconType: "chemistry",
      status: "not-started",
      route: "/objective-exam",
    },
  ]

  const handleStartExam = (midterm: MidtermCard) => {
    if (midterm.status !== "locked" && midterm.status !== "upcoming") {
      router.push(midterm.route)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="ml-20 transition-all duration-300">
        <DashboardHeader />
        <main className="py-8">
          <MidtermListing
            midterms={midterms}
            onStartExam={handleStartExam}
          />
        </main>
      </div>
    </div>
  )
}
