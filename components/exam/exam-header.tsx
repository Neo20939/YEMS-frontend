"use client"

import * as React from "react"
import { Clock, User, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ExamHeaderProps {
  /** Exam/Subject title */
  title: string
  /** Section subtitle (e.g., "Section A: Objective Questions") */
  section?: string
  /** Remaining time string (e.g., "01:42:15") */
  remainingTime?: string
  /** Student name */
  studentName?: string
  /** Student ID */
  studentId?: string
  /** Profile image URL */
  profileImage?: string
  /** Profile image alt text */
  profileAlt?: string
  /** Show timer */
  showTimer?: boolean
  /** Timer variant - "default" or "warning" for low time */
  timerVariant?: "default" | "warning"
  /** School logo image URL */
  logoImage?: string
  /** Additional className */
  className?: string
}

const ExamHeader = React.forwardRef<HTMLElement, ExamHeaderProps>(
  (
    {
      title,
      section,
      remainingTime,
      studentName = "Alex Thompson",
      studentId,
      profileImage,
      profileAlt = "Student profile",
      showTimer = true,
      timerVariant = "default",
      logoImage = "/yhs.jpg",
      className,
    },
    ref
  ) => {
    return (
      <header
        ref={ref}
        className={cn(
          "sticky top-0 z-50 bg-cream/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-beige/60 dark:border-slate-800/60 px-6 py-3 flex items-center justify-between shadow-sm",
          className
        )}
      >
        {/* Left Section - Exam Info */}
        <div className="flex items-center gap-4">
          <div className="bg-secondary p-2 rounded-lg text-primary">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-800 dark:text-slate-200">
              {title}
            </h1>
            {section && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {section}
              </p>
            )}
          </div>
        </div>

        {/* Center Section - School Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
          {logoImage && (
            <img
              src={logoImage}
              alt="School logo"
              className="h-16 w-auto object-contain"
            />
          )}
        </div>

        {/* Right Section - Timer & User */}
        <div className="flex items-center gap-6">
          {showTimer && remainingTime && (
            <>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-xl",
                  timerVariant === "warning"
                    ? "bg-secondary/50 text-primary border border-primary/20"
                    : "bg-beige/50 dark:bg-slate-800/70"
                )}
              >
                <Clock
                  className={cn(
                    "h-5 w-5",
                    timerVariant === "warning" ? "text-primary" : "text-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-lg font-mono font-bold tracking-wider",
                    timerVariant === "warning"
                      ? "text-primary dark:text-primary-light"
                      : "text-slate-700 dark:text-slate-200"
                  )}
                >
                  {remainingTime}
                </span>
              </div>
              <div className="h-8 w-px bg-beige/60 dark:bg-slate-700/60" />
            </>
          )}

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {studentName}
              </p>
              {studentId && (
                <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ID: {studentId}
                </p>
              )}
            </div>
            <div
              className={cn(
                "size-10 rounded-full bg-beige bg-cover bg-center border-2 border-white/80 dark:border-slate-700/80 shadow-sm",
                !profileImage && "flex items-center justify-center bg-secondary"
              )}
              style={
                profileImage ? { backgroundImage: `url('${profileImage}')` } : undefined
              }
              aria-label={profileAlt}
            >
              {!profileImage && (
                <User className="h-5 w-5 text-primary" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      </header>
    )
  }
)

ExamHeader.displayName = "ExamHeader"

export { ExamHeader }
