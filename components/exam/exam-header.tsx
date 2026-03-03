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
          "sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between shadow-sm",
          className
        )}
      >
        {/* Left Section - Exam Info */}
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-100">
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
                    ? "bg-orange-50 text-orange-600 border border-orange-100"
                    : "bg-slate-100 dark:bg-slate-800"
                )}
              >
                <Clock
                  className={cn(
                    "h-5 w-5",
                    timerVariant === "warning" ? "text-orange-600" : "text-primary"
                  )}
                />
                <span
                  className={cn(
                    "text-lg font-mono font-bold tracking-wider",
                    timerVariant === "warning"
                      ? "text-orange-700 dark:text-orange-200"
                      : "text-slate-700 dark:text-slate-200"
                  )}
                >
                  {remainingTime}
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            </>
          )}

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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
                "size-10 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-sm",
                !profileImage && "flex items-center justify-center bg-primary/10"
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
