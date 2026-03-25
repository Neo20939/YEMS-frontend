"use client"

import { TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { DashboardKPI } from "@/types/accountant"

interface KPICardsProps {
  kpis: DashboardKPI;
}

export default function KPICards({ kpis }: KPICardsProps) {
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  const cards = [
    {
      title: "Total Collected",
      value: formatCurrency(kpis.totalCollected),
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      trend: "+12.5% from last month",
      trendUp: true,
    },
    {
      title: "Outstanding Fees",
      value: formatCurrency(kpis.totalOutstanding),
      icon: AlertCircle,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      trend: `${kpis.overdueCount} students overdue`,
      trendUp: false,
    },
    {
      title: "Collection Rate",
      value: `${kpis.collectionRate.toFixed(1)}%`,
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
      trend: "+3.2% from last month",
      trendUp: true,
    },
    {
      title: "Cash Balance",
      value: formatCurrency(kpis.cashBalance),
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      trend: "Available for operations",
      trendUp: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.title}
            className={`bg-white rounded-2xl p-6 border ${card.borderColor} shadow-soft hover:shadow-lg transition-all duration-200`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{card.value}</h3>
                <p className={`text-xs mt-2 font-medium ${card.trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {card.trend}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
