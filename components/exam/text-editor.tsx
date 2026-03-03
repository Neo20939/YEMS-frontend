"use client"

import * as React from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Cloud,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TextEditorProps {
  /** Editor placeholder text */
  placeholder?: string
  /** Initial value */
  value?: string
  /** On value change */
  onChange?: (value: string) => void
  /** Word count */
  wordCount?: number
  /** Character count */
  characterCount?: number
  /** Auto-save status */
  autoSaveStatus?: "saving" | "saved" | "error"
  /** Last saved time string */
  lastSavedTime?: string
  /** Minimum height in pixels */
  minHeight?: number
  /** Show word count */
  showWordCount?: boolean
  /** Show character count */
  showCharacterCount?: boolean
  /** Show auto-save indicator */
  showAutoSave?: boolean
  /** Show formatting toolbar */
  showToolbar?: boolean
  /** On bold click */
  onBold?: () => void
  /** On italic click */
  onItalic?: () => void
  /** On underline click */
  onUnderline?: () => void
  /** On bullet list click */
  onBulletList?: () => void
  /** On numbered list click */
  onNumberedList?: () => void
  /** Additional className */
  className?: string
}

const TextEditor = React.forwardRef<HTMLDivElement, TextEditorProps>(
  (
    {
      placeholder = "Type your detailed answer here...",
      value = "",
      onChange,
      wordCount = 0,
      characterCount = 0,
      autoSaveStatus = "saved",
      lastSavedTime,
      minHeight = 500,
      showWordCount = true,
      showCharacterCount = true,
      showAutoSave = true,
      showToolbar = true,
      onBold,
      onItalic,
      onUnderline,
      onBulletList,
      onNumberedList,
      className,
    },
    ref
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col rounded-xl bg-white shadow-md border border-slate-200 overflow-hidden",
          className
        )}
        style={{ minHeight: `${minHeight}px` }}
      >
        {/* Toolbar */}
        {showToolbar && (
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-4 py-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onBold}
                className="h-8 w-8"
              >
                <Bold className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onItalic}
                className="h-8 w-8"
              >
                <Italic className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onUnderline}
                className="h-8 w-8"
              >
                <Underline className="h-5 w-5" />
              </Button>
              <div className="mx-1 h-4 w-px bg-slate-300" />
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onBulletList}
                className="h-8 w-8"
              >
                <List className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={onNumberedList}
                className="h-8 w-8"
              >
                <ListOrdered className="h-5 w-5" />
              </Button>
            </div>

            {showAutoSave && (
              <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                {autoSaveStatus === "saved" && (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Auto-saved
                  </>
                )}
                {autoSaveStatus === "saving" && (
                  <>
                    <Cloud className="h-4 w-4 animate-pulse" />
                    Saving...
                  </>
                )}
                {autoSaveStatus === "error" && (
                  <>
                    <Cloud className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Save failed</span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent p-8 text-lg leading-relaxed text-slate-800 placeholder:text-slate-300 focus:ring-0 resize-none"
          style={{ minHeight: `${minHeight - 100}px` }}
        />

        {/* Editor Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3">
          <div className="flex items-center gap-4">
            {showWordCount && (
              <p className="text-xs font-bold text-slate-400">
                WORDS: <span className="text-slate-900">{wordCount}</span>
              </p>
            )}
            {showCharacterCount && (
              <p className="text-xs font-bold text-slate-400">
                CHARACTERS: <span className="text-slate-900">{characterCount}</span>
              </p>
            )}
          </div>
          {lastSavedTime && (
            <div className="text-xs font-medium text-slate-400 italic">
              Last manually saved at {lastSavedTime}
            </div>
          )}
        </div>
      </div>
    )
  }
)

TextEditor.displayName = "TextEditor"

export { TextEditor }
