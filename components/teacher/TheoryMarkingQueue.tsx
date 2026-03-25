"use client"

import React, { useState, useEffect } from "react"
import { getTheoryMarkingQueue, submitTheoryMark } from "@/lib/api/question-client"
import type { TheoryMarkingItem, MarkingQueueFilters, SubmitMarkRequest } from "@/lib/api/types"
import { FileText, CheckCircle, Clock, AlertCircle, ChevronLeft, ChevronRight, X } from "lucide-react"

interface TheoryMarkingQueueProps {
  examId?: string
  onMarkComplete?: () => void
}

export function TheoryMarkingQueue({ examId, onMarkComplete }: TheoryMarkingQueueProps) {
  const [items, setItems] = useState<TheoryMarkingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<TheoryMarkingItem | null>(null)
  const [markingItem, setMarkingItem] = useState<TheoryMarkingItem | null>(null)
  const [filters, setFilters] = useState<MarkingQueueFilters>({
    status: "pending",
    sortBy: "submittedAt",
    sortOrder: "asc",
    limit: 20,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    pending: 0,
    marked: 0,
    reviewRequired: 0,
  })
  const [statistics, setStatistics] = useState({
    avgMarkingTime: 0,
    avgScore: 0,
    totalSubmissions: 0,
  })

  useEffect(() => {
    loadQueue()
  }, [examId, filters])

  const loadQueue = async () => {
    setLoading(true)
    setError(null)

    const result = await getTheoryMarkingQueue(examId, filters)

    if (result.success && result.data) {
      setItems(result.data.items)
      setPagination(result.data.pagination)
      setStatistics(result.data.statistics)
    } else {
      setError(result.error?.message || "Failed to load marking queue")
    }

    setLoading(false)
  }

  const handleStatusFilter = (status: MarkingQueueFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status, offset: 0 }))
  }

  const handleSubmitMark = async (payload: SubmitMarkRequest) => {
    if (!markingItem || !examId) return

    const result = await submitTheoryMark(examId, markingItem.id, payload)

    if (result.success) {
      setMarkingItem(null)
      loadQueue()
      onMarkComplete?.()
    } else {
      setError(result.error?.message || "Failed to submit mark")
    }
  }

  const getStatusIcon = (status: TheoryMarkingItem["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "marked":
        return <CheckCircle className="w-4 h-4" />
      case "review-required":
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColors = (status: TheoryMarkingItem["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "marked":
        return "bg-green-50 text-green-700 border-green-200"
      case "review-required":
        return "bg-red-50 text-red-700 border-red-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Theory Marking Queue</h2>
        <button
          onClick={loadQueue}
          className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Submissions"
          value={statistics.totalSubmissions.toString()}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={pagination.pending.toString()}
          color="yellow"
        />
        <StatCard
          title="Marked"
          value={pagination.marked.toString()}
          color="green"
        />
        <StatCard
          title="Needs Review"
          value={pagination.reviewRequired.toString()}
          color="red"
        />
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleStatusFilter("pending")}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            filters.status === "pending"
              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Pending ({pagination.pending})
        </button>
        <button
          onClick={() => handleStatusFilter("marked")}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            filters.status === "marked"
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Marked ({pagination.marked})
        </button>
        <button
          onClick={() => handleStatusFilter("review-required")}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            filters.status === "review-required"
              ? "bg-red-100 text-red-700 border-red-200"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          Review Required ({pagination.reviewRequired})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Queue Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No submissions found</p>
          <p className="text-sm text-gray-400 mt-1">
            {filters.status === "pending"
              ? "All caught up! No pending submissions."
              : "Try changing your filter"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Exam</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{item.studentName}</p>
                    <p className="text-xs text-gray-500">ID: {item.studentId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{item.examTitle}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700 truncate max-w-xs">{item.questionText}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColors(item.status)}`}
                    >
                      {getStatusIcon(item.status)}
                      {item.status.replace("-", " ").toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{formatTimestamp(item.submittedAt)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.status === "pending" && (
                      <button
                        onClick={() => setMarkingItem(item)}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        Mark
                      </button>
                    )}
                    {item.status === "marked" && (
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Marking Modal */}
      {markingItem && (
        <MarkingModal
          item={markingItem}
          onSubmit={handleSubmitMark}
          onClose={() => setMarkingItem(null)}
        />
      )}

      {/* View Submission Modal */}
      {selectedItem && (
        <ViewSubmissionModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string
  value: string
  color: "blue" | "yellow" | "green" | "red"
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-700",
    green: "bg-green-50 text-green-700",
    red: "bg-red-50 text-red-700",
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${colors[color]}`}>{value}</p>
    </div>
  )
}

function MarkingModal({
  item,
  onSubmit,
  onClose,
}: {
  item: TheoryMarkingItem
  onSubmit: (payload: SubmitMarkRequest) => void
  onClose: () => void
}) {
  const [marks, setMarks] = useState("")
  const [feedback, setFeedback] = useState("")
  const [requiresReview, setRequiresReview] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      marks: parseInt(marks),
      feedback: feedback || undefined,
      requiresReview,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Mark Submission</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Student:</span>
              <p className="font-medium text-gray-900">{item.studentName}</p>
            </div>
            <div>
              <span className="text-gray-500">Exam:</span>
              <p className="font-medium text-gray-900">{item.examTitle}</p>
            </div>
          </div>

          {/* Question */}
          <div>
            <span className="text-gray-500 text-sm">Question:</span>
            <p className="text-gray-900 font-medium mt-1">{item.questionText}</p>
          </div>

          {/* Answer */}
          <div>
            <span className="text-gray-500 text-sm">Student Answer:</span>
            <div className="mt-1 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{item.answerText}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.wordCount} words</p>
          </div>

          {/* Marking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marks (out of {item.maxMarks})
              </label>
              <input
                type="number"
                min="0"
                max={item.maxMarks}
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                placeholder="Provide feedback to the student..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="requiresReview"
                checked={requiresReview}
                onChange={(e) => setRequiresReview(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="requiresReview" className="text-sm text-gray-700">
                Flag for review (e.g., potential academic integrity concern)
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-[#942D4B] transition-colors"
              >
                Submit Mark
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

function ViewSubmissionModal({
  item,
  onClose,
}: {
  item: TheoryMarkingItem
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Submission Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Student:</span>
              <p className="font-medium text-gray-900">{item.studentName}</p>
            </div>
            <div>
              <span className="text-gray-500">Submitted:</span>
              <p className="font-medium text-gray-900">
                {new Date(item.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <span className="text-gray-500 text-sm">Question:</span>
            <p className="text-gray-900 font-medium mt-1">{item.questionText}</p>
          </div>

          <div>
            <span className="text-gray-500 text-sm">Answer:</span>
            <div className="mt-1 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{item.answerText}</p>
            </div>
          </div>

          {item.marks !== undefined && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 text-sm">Marks Awarded:</span>
                <p className="text-2xl font-bold text-gray-900">
                  {item.marks} / {item.maxMarks}
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Status:</span>
                <p className="text-lg font-medium capitalize">{item.status}</p>
              </div>
            </div>
          )}

          {item.feedback && (
            <div>
              <span className="text-gray-500 text-sm">Feedback:</span>
              <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900">{item.feedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TheoryMarkingQueue
