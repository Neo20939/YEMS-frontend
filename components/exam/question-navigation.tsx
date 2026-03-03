"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface QuestionNavigationProps {
  /** Show previous button */
  showPrevious?: boolean
  /** Show save & next button */
  showSaveAndNext?: boolean
  /** Previous button disabled */
  previousDisabled?: boolean
  /** Custom text for save & next */
  saveAndNextText?: string
  /** On previous click */
  onPrevious?: () => void
  /** On save & next click */
  onSaveAndNext?: () => void
  /** Additional className */
  className?: string
}

const QuestionNavigation = React.forwardRef<HTMLDivElement, QuestionNavigationProps>(
  (
    {
      showPrevious = true,
      showSaveAndNext = true,
      previousDisabled = false,
      saveAndNextText = "Save & Next",
      onPrevious,
      onSaveAndNext,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between pt-4", className)}
      >
        <Button
          variant="secondary"
          onClick={onPrevious}
          disabled={previousDisabled}
          className="h-auto px-6 py-3"
        >
          <ArrowLeft className="h-5 w-5" />
          Previous
        </Button>

        <div className="flex gap-4">
          {showSaveAndNext && (
            <Button
              variant="default"
              onClick={onSaveAndNext}
              className="h-auto px-8 py-3"
            >
              {saveAndNextText}
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    )
  }
)

QuestionNavigation.displayName = "QuestionNavigation"

export { QuestionNavigation }
