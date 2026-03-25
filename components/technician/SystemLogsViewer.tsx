"use client"

import React, { useState, useEffect } from "react"
import { getSystemLogs } from "@/lib/api/monitoring-client"
import type { SystemLog, GetLogsFilters } from "@/lib/api/types"
import { Search, Filter, AlertCircle, AlertTriangle, Info, FileText, X, ChevronLeft, ChevronRight } from "lucide-react"

interface SystemLogsViewerProps {
  onRefresh?: () => void
}

export function SystemLogsViewer({ onRefresh }: SystemLogsViewerProps) {
  const [logs, setLogs] = useState<SystemLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null)
  const [filters, setFilters] = useState<GetLogsFilters>({
    level: undefined,
    search: "",
    limit: 50,
    offset: 0,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  })

  useEffect(() => {
    loadLogs()
  }, [filters])

  const loadLogs = async () => {
    setLoading(true)
    setError(null)

    const result = await getSystemLogs(filters)

    if (result.success && result.data) {
      setLogs(result.data.logs)
      setPagination(result.data.pagination)
    } else {
      setError(result.error?.message || "Failed to load logs")
    }

    setLoading(false)
  }

  const handleRefresh = () => {
    loadLogs()
    onRefresh?.()
  }

  const handleFilterChange = (key: keyof GetLogsFilters, value: string | number | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value, offset: 0 }))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange("search", e.target.value)
  }

  const handleLevelFilter = (level: GetLogsFilters["level"]) => {
    handleFilterChange("level", level === filters.level ? undefined : level)
  }

  const handlePageChange = (direction: "next" | "prev") => {
    if (direction === "next" && pagination.hasMore) {
      handleFilterChange("offset", pagination.offset + pagination.limit)
    } else if (direction === "prev" && pagination.offset > 0) {
      handleFilterChange("offset", Math.max(0, pagination.offset - pagination.limit))
    }
  }

  const getLevelIcon = (level: SystemLog["level"]) => {
    switch (level) {
      case "error":
        return <AlertCircle className="w-4 h-4" />
      case "warn":
        return <AlertTriangle className="w-4 h-4" />
      case "info":
        return <Info className="w-4 h-4" />
      case "debug":
        return <FileText className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getLevelColors = (level: SystemLog["level"]) => {
    switch (level) {
      case "error":
        return "bg-red-50 text-red-700 border-red-200"
      case "warn":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "debug":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">System Logs</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search || ""}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Level Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <button
              onClick={() => handleLevelFilter("error")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.level === "error"
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Errors
            </button>
            <button
              onClick={() => handleLevelFilter("warn")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.level === "warn"
                  ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Warnings
            </button>
            <button
              onClick={() => handleLevelFilter("info")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.level === "info"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Info
            </button>
            <button
              onClick={() => handleLevelFilter("debug")}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                filters.level === "debug"
                  ? "bg-gray-100 text-gray-700 border-gray-200"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              Debug
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {logs.length} of {pagination.total} logs
          </span>
          {filters.level && (
            <button
              onClick={() => handleFilterChange("level", undefined)}
              className="text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Logs Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No logs found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-3">Level</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getLevelColors(log.level)}`}
                      >
                        {getLevelIcon(log.level)}
                        {log.level.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 truncate max-w-md">{log.message}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{log.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{formatTimestamp(log.timestamp)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedLog(log)
                        }}
                        className="text-primary hover:text-primary/80 text-sm font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={pagination.offset === 0}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-sm text-gray-500">
              Page {Math.floor(pagination.offset / pagination.limit) + 1}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={!pagination.hasMore}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <span className="text-sm text-gray-500">Level</span>
                <p className="text-base font-medium capitalize">{selectedLog.level}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Message</span>
                <p className="text-base text-gray-900">{selectedLog.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Source</span>
                  <p className="text-base text-gray-900">{selectedLog.source}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Timestamp</span>
                  <p className="text-base text-gray-900">
                    {formatTimestamp(selectedLog.timestamp)}
                  </p>
                </div>
              </div>
              {selectedLog.stack && (
                <div>
                  <span className="text-sm text-gray-500">Stack Trace</span>
                  <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 overflow-x-auto">
                    {selectedLog.stack}
                  </pre>
                </div>
              )}
              {selectedLog.metadata && (
                <div>
                  <span className="text-sm text-gray-500">Metadata</span>
                  <pre className="mt-1 p-3 bg-gray-50 rounded-lg text-xs text-gray-700 overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SystemLogsViewer
