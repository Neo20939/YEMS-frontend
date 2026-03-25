"use client"

import React, { useState, useCallback } from "react"
import { bulkUploadObjectiveQuestions, bulkUploadTheoryQuestions, parseQuestionFile } from "@/lib/api/question-client"
import type { BulkQuestionUpload, BulkUploadResult } from "@/lib/api/types"
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react"

interface BulkQuestionUploadProps {
  examId: string
  examType: "objective" | "theory"
  onSuccess?: () => void
}

export function BulkQuestionUploader({ examId, examType, onSuccess }: BulkQuestionUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<BulkQuestionUpload | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<BulkUploadResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    setError(null)
    setResult(null)
    setFile(selectedFile)

    try {
      const parsed = await parseQuestionFile(selectedFile)
      setPreview(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse file")
      setFile(null)
    }
  }, [])

  const handleUpload = async () => {
    if (!preview || !file) return

    setUploading(true)
    setError(null)

    const uploadFn = examType === "objective"
      ? bulkUploadObjectiveQuestions
      : bulkUploadTheoryQuestions

    const response = await uploadFn(examId, preview)

    if (response.success && response.data) {
      setResult(response.data.result)
      onSuccess?.()
    } else {
      setError(response.error?.message || "Upload failed")
    }

    setUploading(false)
  }

  const handleReset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const downloadTemplate = () => {
    const template = {
      questions: [
        {
          type: examType === "objective" ? "multiple-choice" : "short-answer",
          text: "What is the capital of France?",
          options: examType === "objective" ? [
            { label: "A", text: "London", isCorrect: false },
            { label: "B", text: "Paris", isCorrect: true },
            { label: "C", text: "Berlin", isCorrect: false },
            { label: "D", text: "Madrid", isCorrect: false },
          ] : undefined,
          correctAnswer: examType === "objective" ? "B" : undefined,
          explanation: "Paris is the capital city of France.",
          marks: 1,
          difficulty: "easy" as const,
          topic: "Geography",
          tags: ["capitals", "europe"],
        },
      ],
    }

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `question-template-${examType}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Bulk Upload {examType === "objective" ? "Objective Questions" : "Theory Questions"}
        </h3>
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Upload Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Download the template file to see the required JSON format</li>
              <li>Prepare your questions in a JSON file following the template</li>
              <li>For objective questions, include options with correct answers</li>
              <li>For theory questions, include the question text and marks</li>
              <li>Maximum 100 questions per upload</li>
            </ul>
          </div>
        </div>
      </div>

      {/* File Upload */}
      {!result ? (
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              error
                ? "border-red-300 bg-red-50"
                : file
                ? "border-green-300 bg-green-50"
                : "border-gray-300 hover:border-primary/50 hover:bg-gray-50"
            }`}
          >
            <input
              type="file"
              accept=".json"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="space-y-3">
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  <div>
                    <p className="font-medium text-gray-900">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">JSON file only (MAX. 1MB)</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-lg">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Preview</h4>
                <button
                  onClick={handleReset}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                  disabled={uploading}
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{preview.questions.length} questions</span>
                <span>•</span>
                <span>
                  {preview.questions.filter((q) => q.type === "multiple-choice").length} MCQs
                </span>
                <span>•</span>
                <span>
                  {preview.questions.filter((q) => q.type === "single-choice").length} Single Choice
                </span>
              </div>
            </div>
          )}

          {/* Upload Button */}
          {preview && (
            <div className="flex justify-end gap-3">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#942D4B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? "Uploading..." : `Upload ${preview.questions.length} Questions`}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Upload Result */
        <div className="space-y-4">
          <div
            className={`rounded-xl p-6 ${
              result.success
                ? "bg-green-50 border border-green-200"
                : "bg-yellow-50 border border-yellow-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {result.success ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
              <h4 className="text-lg font-semibold text-gray-900">Upload Complete</h4>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">{result.totalQuestions}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-500">Successful</p>
                <p className="text-2xl font-bold text-green-600">{result.successful}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600">{result.failed}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {((result.successful / result.totalQuestions) * 100).toFixed(0)}%
                </p>
              </div>
            </div>

            {result.message && (
              <p className="text-sm text-gray-600">{result.message}</p>
            )}
          </div>

          {/* Errors */}
          {result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="font-medium text-red-900 mb-3">Failed Questions</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {result.errors.map((err, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 text-sm">
                    <p className="text-gray-900 font-medium">Question {err.index + 1}: {err.question}</p>
                    <p className="text-red-600 mt-1">{err.error}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Upload Another File
            </button>
          </div>
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

export default BulkQuestionUploader
