"use client"

import React, { useEffect, useState } from "react"
import { getSystemMetrics, getSystemHealth, getSystemDiagnostics } from "@/lib/api/monitoring-client"
import type { SystemMetrics, SystemHealth, SystemDiagnostics } from "@/lib/api/types"
import { Activity, Server, Database, Cpu, HardDrive, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MonitoringPanelProps {
  onRefresh?: () => void
}

export function MonitoringPanel({ onRefresh }: MonitoringPanelProps) {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [diagnostics, setDiagnostics] = useState<SystemDiagnostics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMonitoringData()
  }, [])

  const loadMonitoringData = async () => {
    setLoading(true)
    setError(null)

    console.log('[MonitoringPanel] Loading monitoring data...')

    const [metricsResult, healthResult, diagnosticsResult] = await Promise.all([
      getSystemMetrics(),
      getSystemHealth(),
      getSystemDiagnostics(),
    ])

    console.log('[MonitoringPanel] Metrics result:', metricsResult)
    console.log('[MonitoringPanel] Health result:', healthResult)
    console.log('[MonitoringPanel] Diagnostics result:', diagnosticsResult)

    if (metricsResult.success && metricsResult.data) {
      setMetrics(metricsResult.data)
    }
    if (healthResult.success && healthResult.data) {
      setHealth(healthResult.data)
    }
    if (diagnosticsResult.success && diagnosticsResult.data) {
      setDiagnostics(diagnosticsResult.data)
    }

    // Collect errors
    const errors = []
    if (!metricsResult.success) errors.push('Metrics')
    if (!healthResult.success) errors.push('Health')
    if (!diagnosticsResult.success) errors.push('Diagnostics')

    if (errors.length > 0) {
      const errorMsg = `Failed to load: ${errors.join(', ')}`
      console.error('[MonitoringPanel]', errorMsg, { metricsResult, healthResult, diagnosticsResult })
      setError(errorMsg)
    }

    setLoading(false)
  }

  const handleRefresh = () => {
    loadMonitoringData()
    onRefresh?.()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">System Monitoring</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthStatusCard
          title="Overall Status"
          status={health?.status || "unknown"}
          icon={Activity}
        />
        <HealthStatusCard
          title="Database"
          status={health?.checks.database || "unknown"}
          icon={Database}
        />
        <HealthStatusCard
          title="Cache"
          status={health?.checks.cache || "unknown"}
          icon={Server}
        />
        <HealthStatusCard
          title="Storage"
          status={health?.checks.storage || "unknown"}
          icon={HardDrive}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CPU Usage */}
        <MetricCard
          title="CPU Usage"
          value={`${metrics?.cpuUsage.percent.toFixed(1) || 0}%`}
          icon={Cpu}
          trend={getTrend(metrics?.cpuUsage.percent || 0, 50)}
        />

        {/* Memory Usage */}
        <MetricCard
          title="Memory Usage"
          value={formatBytes(metrics?.memoryUsage.heapUsed || 0)}
          subtitle={`of ${formatBytes(metrics?.memoryUsage.heapTotal || 0)}`}
          icon={Server}
          trend="stable"
        />

        {/* Active Connections */}
        <MetricCard
          title="Active Connections"
          value={metrics?.activeConnections.toString() || "0"}
          icon={Activity}
          trend={getTrend(metrics?.activeConnections || 0, 100)}
        />

        {/* Requests per Minute */}
        <MetricCard
          title="Requests/min"
          value={metrics?.requestsPerMinute.toString() || "0"}
          icon={TrendingUp}
          trend="increasing"
        />

        {/* Error Rate */}
        <MetricCard
          title="Error Rate"
          value={`${(metrics?.errorRate || 0).toFixed(2)}%`}
          icon={Activity}
          trend={getTrend(metrics?.errorRate || 0, 1, true)}
        />

        {/* Uptime */}
        <MetricCard
          title="Uptime"
          value={formatUptime(metrics?.uptime || 0)}
          icon={Server}
          trend="stable"
        />
      </div>

      {/* Diagnostics Section */}
      {diagnostics && (
        <>
          {/* Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Diagnostics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {diagnostics.performance.avgResponseTime.toFixed(0)}ms
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Memory Trend</p>
                <div className="flex items-center gap-2">
                  {diagnostics.performance.memoryTrend === "increasing" && (
                    <TrendingUp className="w-5 h-5 text-red-500" />
                  )}
                  {diagnostics.performance.memoryTrend === "decreasing" && (
                    <TrendingDown className="w-5 h-5 text-green-500" />
                  )}
                  {diagnostics.performance.memoryTrend === "stable" && (
                    <Minus className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-lg font-medium capitalize">
                    {diagnostics.performance.memoryTrend}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Slow Queries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {diagnostics.database.slowQueries}
                </p>
              </div>
            </div>
          </div>

          {/* Database Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Active Connections</p>
                <p className="text-xl font-bold text-gray-900">
                  {diagnostics.database.connections.active}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Idle Connections</p>
                <p className="text-xl font-bold text-gray-900">
                  {diagnostics.database.connections.idle}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Max Connections</p>
                <p className="text-xl font-bold text-gray-900">
                  {diagnostics.database.connections.max}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Queries/sec</p>
                <p className="text-xl font-bold text-gray-900">
                  {diagnostics.database.queriesPerSecond.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          {/* Errors Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Errors (24h)</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Errors</span>
                <span className="text-lg font-bold text-gray-900">
                  {diagnostics.errors.total24h}
                </span>
              </div>
              {diagnostics.errors.byType.map((errorType, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-700">{errorType.type}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{errorType.count}</span>
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(errorType.lastOccurrence)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* System Info */}
      {health && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Version:</span>
              <p className="font-medium text-gray-900">{health.version}</p>
            </div>
            <div>
              <span className="text-gray-500">Node.js:</span>
              <p className="font-medium text-gray-900">{health.nodeVersion}</p>
            </div>
            <div>
              <span className="text-gray-500">Platform:</span>
              <p className="font-medium text-gray-900 capitalize">{health.platform}</p>
            </div>
            <div>
              <span className="text-gray-500">Architecture:</span>
              <p className="font-medium text-gray-900">{health.arch}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function HealthStatusCard({
  title,
  status,
  icon: Icon,
}: {
  title: string
  status: string
  icon: React.ElementType
}) {
  const statusColors: Record<string, string> = {
    healthy: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    critical: "bg-red-50 text-red-700 border-red-200",
    unknown: "bg-gray-50 text-gray-700 border-gray-200",
  }

  const indicatorColors: Record<string, string> = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
    unknown: "bg-gray-400",
  }

  return (
    <div className={`rounded-xl border p-4 ${statusColors[status] || statusColors.unknown}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className="w-5 h-5" />
        <span className={`w-2 h-2 rounded-full ${indicatorColors[status] || indicatorColors.unknown}`} />
      </div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-lg font-bold capitalize">{status}</p>
    </div>
  )
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  trend: "increasing" | "decreasing" | "stable"
}) {
  const trendColors = {
    increasing: "text-green-600",
    decreasing: "text-red-600",
    stable: "text-gray-600",
  }

  const TrendIcon = trend === "increasing" ? TrendingUp : trend === "decreasing" ? TrendingDown : Minus

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <TrendIcon className={`w-4 h-4 ${trendColors[trend]}`} />
      </div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}d ${hours % 24}h`
  }
  return `${hours}h ${minutes}m`
}

function getTrend(value: number, threshold: number, lowerIsBetter = false): "increasing" | "decreasing" | "stable" {
  if (lowerIsBetter) {
    if (value < threshold) return "decreasing"
    if (value > threshold * 2) return "increasing"
    return "stable"
  }
  if (value < threshold) return "decreasing"
  if (value > threshold * 1.5) return "increasing"
  return "stable"
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export default MonitoringPanel
