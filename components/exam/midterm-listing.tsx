"use client"

import * as React from "react"
import { Clock, BookOpen, AlertCircle, Lock, Brain, Atom, Globe, FlaskConical, PenTool, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface MidtermCard {
  /** Unique exam identifier */
  id: string
  /** Exam title */
  title: string
  /** Exam description/subtitle */
  description: string
  /** Duration in minutes */
  duration: number
  /** Number of questions */
  questions: number
  /** Exam status */
  status: "not-started" | "upcoming" | "new" | "locked"
  /** Subject icon type */
  iconType: "math" | "science" | "english" | "philosophy" | "history" | "chemistry"
  /** Route to navigate to */
  route: string
}

export interface MidtermListingProps {
  /** Page title */
  title?: string
  /** Subtitle text */
  subtitle?: string
  /** Academic session label */
  sessionLabel?: string
  /** List of midterms to display */
  midterms: MidtermCard[]
  /** Callback when Start Exam is clicked */
  onStartExam?: (midterm: MidtermCard) => void
  /** Additional className */
  className?: string
  /** Loading state */
  isLoading?: boolean
}

const MidtermListing = React.forwardRef<HTMLDivElement, MidtermListingProps>(
  (
    {
      title = "Mid Term Examinations",
      subtitle = "View and manage your scheduled assessments. Ensure you have a stable internet connection before starting any exam.",
      sessionLabel = "ACADEMIC SESSION 2024/2025",
      midterms,
      onStartExam,
      className,
      isLoading = false,
    },
    ref
  ) => {
    const [filter, setFilter] = React.useState<"all" | "upcoming" | "completed">("all")

    const filteredMidterms = React.useMemo(() => {
      if (filter === "upcoming") {
        return midterms.filter((midterm) => midterm.status === "upcoming")
      }
      return midterms
    }, [midterms, filter])

    const handleStartExam = (midterm: MidtermCard) => {
      if (midterm.status !== "locked" && onStartExam) {
        onStartExam(midterm)
      }
    }

    if (isLoading) {
      return (
        <div ref={ref} className={cn("w-full max-w-7xl mx-auto px-6 py-8", className)}>
          {/* Header Banner Skeleton */}
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-3xl p-10 mb-10 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide mb-4 w-48 h-6"></div>
                <div className="h-10 bg-white/20 rounded w-64 mb-3"></div>
                <div className="h-4 bg-white/20 rounded w-96"></div>
              </div>
              <div className="hidden lg:flex items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm">
                <div className="w-16 h-16 bg-white/20 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Loading Cards */}
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-1"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-80"></div>
                      </div>
                      <div className="w-24 h-8 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-32 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("w-full max-w-7xl mx-auto px-6 py-8", className)}>
        {/* Header Banner - Horizontal Layout */}
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-3xl p-10 mb-10 text-white shadow-soft">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold tracking-wide mb-4">
                {sessionLabel}
              </span>
              <h1 className="text-4xl font-bold mb-3">{title}</h1>
              <p className="text-white/90 text-sm max-w-xl leading-relaxed">
                {subtitle}
              </p>
            </div>
            <div className="hidden lg:flex items-center justify-center w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm">
              <BookOpen className="h-16 w-16 text-white/80" />
            </div>
          </div>
        </div>

        {/* Filter Tabs - Pill Style */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Available Assessments
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-beige/30 p-1.5 rounded-xl">
            <button
              onClick={() => setFilter("all")}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                filter === "all"
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-600 hover:bg-white/50"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                filter === "upcoming"
                  ? "bg-primary text-white shadow-md"
                  : "text-slate-600 hover:bg-white/50"
              )}
            >
              Upcoming
            </button>
          </div>
        </div>

        {/* Midterm Cards - List Layout */}
        <div className="space-y-4 mb-8">
          {filteredMidterms.map((midterm, index) => (
            <MidtermCardItem 
              key={midterm.id} 
              midterm={midterm} 
              onClick={handleStartExam}
              index={index}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMidterms.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-4">
              <AlertCircle className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No exams found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {filter === "upcoming"
                ? "No upcoming exams at the moment."
                : "No assessments available."}
            </p>
          </div>
        )}

        {/* Support Text */}
        <div className="text-center pt-6 border-t border-beige">
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <AlertCircle className="h-4 w-4" />
            Having trouble? Contact our{" "}
            <button className="text-primary hover:text-primary-light font-medium underline underline-offset-2">
              technical support team
            </button>
          </p>
        </div>
      </div>
    )
  }
)

MidtermListing.displayName = "MidtermListing"

interface MidtermCardItemProps {
  midterm: MidtermCard
  onClick: (midterm: MidtermCard) => void
  index: number
}

const MidtermCardItem = ({ midterm, onClick, index }: MidtermCardItemProps) => {
  const IconComponent = getIconComponent(midterm.iconType)
  const statusConfig = getStatusConfig(midterm.status)
  const isLocked = midterm.status === "locked" || midterm.status === "upcoming"

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 p-6",
        !isLocked
          ? "border-beige hover:border-primary-light hover:shadow-lg cursor-pointer"
          : "border-slate-200 dark:border-slate-700 opacity-60 cursor-not-allowed"
      )}
      onClick={() => !isLocked && onClick(midterm)}
      role={!isLocked ? "button" : undefined}
      tabIndex={!isLocked ? 0 : undefined}
    >
      <div className="flex items-center gap-6">
        {/* Icon - Large Circle */}
        <div
          className={cn(
            "flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl transition-transform group-hover:scale-105",
            getIconBgColor(midterm.iconType)
          )}
        >
          <IconComponent className="h-10 w-10" />
        </div>

        {/* Content - Grow */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {midterm.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {midterm.description}
              </p>
            </div>
            <span
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide",
                statusConfig.bgColor
              )}
            >
              {statusConfig.label}
            </span>
          </div>

          {/* Meta Info - Horizontal */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Clock className="h-4 w-4 text-primary" />
              <span><strong>{midterm.duration}</strong> minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <BookOpen className="h-4 w-4 text-primary" />
              <span><strong>{midterm.questions}</strong> questions</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0">
          {isLocked ? (
            <Button
              className="bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed px-6"
              size="lg"
              disabled
            >
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </Button>
          ) : (
            <Button
              className="bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30 px-8"
              size="lg"
              onClick={(e) => {
                e.stopPropagation()
                onClick(midterm)
              }}
            >
              Start Exam
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function getIconComponent(iconType: MidtermCard["iconType"]) {
  switch (iconType) {
    case "math":
      return Brain
    case "science":
      return Atom
    case "english":
      return BookOpen
    case "philosophy":
      return Globe
    case "history":
      return History
    case "chemistry":
      return FlaskConical
    default:
      return BookOpen
  }
}

function getIconBgColor(iconType: MidtermCard["iconType"]) {
  switch (iconType) {
    case "math":
      return "bg-secondary text-primary"
    case "science":
      return "bg-sage text-white"
    case "english":
      return "bg-beige-light text-beige-dark"
    case "philosophy":
      return "bg-secondary-light text-primary"
    case "history":
      return "bg-beige text-beige-dark"
    case "chemistry":
      return "bg-sage-light text-sage-dark"
    default:
      return "bg-slate-100 text-slate-600"
  }
}

function getStatusConfig(status: MidtermCard["status"]) {
  switch (status) {
    case "not-started":
      return { bgColor: "bg-secondary text-primary", label: "Not Started" }
    case "upcoming":
      return { bgColor: "bg-sage text-white", label: "Upcoming" }
    case "new":
      return { bgColor: "bg-beige-light text-beige-dark", label: "New" }
    case "locked":
      return { bgColor: "bg-slate-100 text-slate-500", label: "Locked" }
  }
}

export { MidtermListing }
