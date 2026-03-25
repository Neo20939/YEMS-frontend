"use client"

import React from "react"
import { Upload, CheckCircle, XCircle } from "lucide-react"

interface UploadProgressProps {
  progress: number
  status: "uploading" | "success" | "error"
  fileName?: string
  fileSize?: number
  errorMessage?: string
  onCancel?: () => void
}

export function UploadProgress({
  progress,
  status,
  fileName,
  fileSize,
  errorMessage,
  onCancel,
}: UploadProgressProps) {
  const isUploading = status === "uploading"
  const isSuccess = status === "success"
  const isError = status === "error"

  return (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              isSuccess
                ? "bg-green-100"
                : isError
                ? "bg-red-100"
                : "bg-primary/10"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : isError ? (
              <XCircle className="w-5 h-5 text-red-600" />
            ) : (
              <Upload className="w-5 h-5 text-primary" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {fileName || "Uploading file..."}
            </p>
            {fileSize && (
              <p className="text-sm text-gray-500">{formatFileSize(fileSize)}</p>
            )}
            {isError && errorMessage && (
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            )}
          </div>
        </div>

        {isUploading && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Uploading...</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Message */}
      {isSuccess && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">Upload successful!</span>
        </div>
      )}

      {/* Error Message */}
      {isError && !errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <XCircle className="w-4 h-4" />
          <span className="font-medium">Upload failed. Please try again.</span>
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

export default UploadProgress
