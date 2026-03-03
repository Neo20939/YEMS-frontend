"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface StickyActionBarProps {
  /** Show previous button */
  showPrevious?: boolean
  /** Show next button */
  showNext?: boolean
  /** Show clear/delete button */
  showClear?: boolean
  /** Show save draft button */
  showSaveDraft?: boolean
  /** Previous button disabled */
  previousDisabled?: boolean
  /** Next button disabled */
  nextDisabled?: boolean
  /** Custom text for next button */
  nextText?: string
  /** Custom text for previous button */
  previousText?: string
  /** Additional left actions */
  leftActions?: React.ReactNode
  /** Additional right actions */
  rightActions?: React.ReactNode
  /** Sidebar width offset (for theory layout) */
  sidebarOffset?: number
  /** On previous click */
  onPrevious?: () => void
  /** On next click */
  onNext?: () => void
  /** On clear click */
  onClear?: () => void
  /** On save draft click */
  onSaveDraft?: () => void
  /** Additional className */
  className?: string
}

const StickyActionBar = React.forwardRef<HTMLDivElement, StickyActionBarProps>(
  (
    {
      showPrevious = true,
      showNext = true,
      showClear = false,
      showSaveDraft = false,
      previousDisabled = false,
      nextDisabled = false,
      nextText = "Next Question",
      previousText = "Previous",
      leftActions,
      rightActions,
      sidebarOffset = 0,
      onPrevious,
      onNext,
      onClear,
      onSaveDraft,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-slate-200 bg-white/80 backdrop-blur-md px-10 py-5",
          sidebarOffset > 0 && "left-[20rem]",
          className
        )}
        style={sidebarOffset > 0 ? { left: `${sidebarOffset}px` } : undefined}
      >
        {/* Left Actions */}
        <div className="flex items-center gap-3">
          {showClear && (
            <Button
              variant="secondary"
              onClick={onClear}
              className="h-11"
            >
              <Trash2 className="h-5 w-5" />
              Clear Response
            </Button>
          )}
          {showSaveDraft && (
            <Button
              variant="outline"
              onClick={onSaveDraft}
              className="h-11"
            >
              <Save className="h-5 w-5" />
              Save Draft
            </Button>
          )}
          {leftActions}
        </div>

        {/* Right Actions - Navigation */}
        <div className="flex items-center gap-3">
          {showPrevious && (
            <Button
              variant="secondary"
              onClick={onPrevious}
              disabled={previousDisabled}
              className="h-11"
            >
              <ArrowLeft className="h-5 w-5" />
              {previousText}
            </Button>
          )}
          {showNext && (
            <Button
              variant="default"
              onClick={onNext}
              disabled={nextDisabled}
              className="h-11"
            >
              {nextText}
              <ArrowRight className="h-5 w-5" />
            </Button>
          )}
          {rightActions}
        </div>
      </div>
    )
  }
)

StickyActionBar.displayName = "StickyActionBar"

export { StickyActionBar }
