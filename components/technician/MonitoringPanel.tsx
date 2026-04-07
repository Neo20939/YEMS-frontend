"use client"

import React, { useEffect, useState } from "react"
import { Activity, Server, Database, Cpu, HardDrive, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MonitoringPanelProps {
  onRefresh?: () => void
}

export function MonitoringPanel({ onRefresh }: MonitoringPanelProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMonitoringData()
  }, [])

  const loadMonitoringData = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
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

      {/* Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HealthStatusCard
          title="Overall Status"
          status="unknown"
          icon={Activity}
        />
        <HealthStatusCard
          title="Database"
          status="unknown"
          icon={Database}
        />
        <HealthStatusCard
          title="Cache"
          status="unknown"
          icon={Server}
        />
        <HealthStatusCard
          title="Storage"
          status="unknown"
          icon={HardDrive}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CPU Usage */}
        <MetricCard
          title="CPU Usage"
          value="0%"
          icon={Cpu}
          trend="stable"
        />

        {/* Memory Usage */}
        <MetricCard
          title="Memory Usage"
          value="0 MB"
          subtitle="of 0 MB"
          icon={Server}
          trend="stable"
        />

        {/* Active Connections */}
        <MetricCard
          title="Active Connections"
          value="0"
          icon={Activity}
          trend="stable"
        />

        {/* Requests per Minute */}
        <MetricCard
          title="Requests/min"
          value="0"
          icon={TrendingUp}
          trend="stable"
        />

        {/* Error Rate */}
        <MetricCard
          title="Error Rate"
          value="0%"
          icon={Activity}
          trend="stable"
        />

        {/* Uptime */}
        <MetricCard
          title="Uptime"
          value="0h 0m"
          icon={Server}
          trend="stable"
        />
      </div>

      {/* Diagnostics Section */}
      <>
        {/* Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Diagnostics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">0ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Memory Trend</p>
              <div className="flex items-center gap-2">
                <Minus className="w-5 h-5 text-gray-500" />
                <span className="text-lg font-medium capitalize">stable</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Slow Queries</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* Database Stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Active Connections</p>
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Idle Connections</p>
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Connections</p>
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Queries/sec</p>
              <p className="text-xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        {/* Errors Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Errors (24h)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total Errors</span>
              <span className="text-lg font-bold text-gray-900">0</span>
            </div>
          </div>
        </div>
      </>

      {/* System Info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Version:</span>
            <p className="font-medium text-gray-900">-</p>
          </div>
          <div>
            <span className="text-gray-500">Node.js:</span>
            <p className="font-medium text-gray-900">-</p>
          </div>
          <div>
            <span className="text-gray-500">Platform:</span>
            <p className="font-medium text-gray-900">-</p>
          </div>
          <div>
            <span className="text-gray-500">Architecture:</span>
            <p className="font-medium text-gray-900">-</p>
          </div>
        </div>
      </div>
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

export default MonitoringPanel