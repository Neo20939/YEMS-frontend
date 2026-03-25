"use client"

import React, { useCallback, useState, DragEvent, ChangeEvent } from "react"
import { Upload, File, X } from "lucide-react"

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void
  onFileClear: () => void
  acceptedFileTypes?: string[]
  maxFileSize?: number // in MB
  multiple?: boolean
  disabled?: boolean
  file?: File | null
}

const DEFAULT_ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "video/mp4",
  "audio/mpeg",
]

const MAX_FILE_SIZE_MB = 50

export function FileUploadZone({
  onFileSelect,
  onFileClear,
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  maxFileSize = MAX_FILE_SIZE_MB,
  multiple = false,
  disabled = false,
  file,
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (selectedFile: File): boolean => {
      // Check file type
      if (!acceptedFileTypes.includes(selectedFile.type)) {
        setError(
          `Invalid file type. Accepted formats: ${getFileTypesDescription(acceptedFileTypes)}`
        )
        return false
      }

      // Check file size
      const fileSizeMB = selectedFile.size / (1024 * 1024)
      if (fileSizeMB > maxFileSize) {
        setError(`File size exceeds ${maxFileSize}MB limit`)
        return false
      }

      setError(null)
      return true
    },
    [acceptedFileTypes, maxFileSize]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      if (disabled) return

      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile && validateFile(droppedFile)) {
        onFileSelect(droppedFile)
      }
    },
    [disabled, onFileSelect, validateFile]
  )

  const handleFileInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0]
      if (selectedFile && validateFile(selectedFile)) {
        onFileSelect(selectedFile)
      }
      // Reset input value to allow selecting the same file again
      e.target.value = ""
    },
    [onFileSelect, validateFile]
  )

  const handleClearFile = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onFileClear()
      setError(null)
    },
    [onFileClear]
  )

  return (
    <div className="space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${
            disabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
              : isDragOver
              ? "border-primary bg-primary/5 cursor-copy"
              : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 cursor-pointer"
          }
        `}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept={acceptedFileTypes.join(",")}
          disabled={disabled}
          multiple={multiple}
        />

        {file ? (
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <File className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-semibold text-gray-900 truncate max-w-md">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(file.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearFile}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={disabled}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/5 mx-auto flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-1">
                {isDragOver ? "Drop file here" : "Click to upload or drag and drop"}
              </h4>
              <p className="text-sm text-gray-500 mb-2">
                {getFileTypesDescription(acceptedFileTypes)} (MAX. {maxFileSize}MB)
              </p>
            </div>
            <button
              type="button"
              className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm pointer-events-none"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}
    </div>
  )
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function getFileTypesDescription(types: string[]): string {
  const typeMap: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
    "application/vnd.ms-powerpoint": "PPT",
    "video/mp4": "MP4",
    "audio/mpeg": "MP3",
  }

  const extensions = types.map((type) => typeMap[type] || type.split("/").pop()?.toUpperCase())
  return extensions.join(", ")
}

export default FileUploadZone
