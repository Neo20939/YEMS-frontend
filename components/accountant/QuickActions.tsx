"use client"

import { FileText, Users, RefreshCcw, FileCheck, TrendingUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QuickActions() {
  const actions = [
    {
      id: "1",
      label: "Generate Reports",
      href: "/accountant/reports",
      icon: FileText,
      color: "bg-primary text-white hover:bg-primary/90",
    },
    {
      id: "2",
      label: "View Overdue",
      href: "/accountant/outstanding",
      icon: AlertTriangle,
      color: "bg-amber-500 text-white hover:bg-amber-600",
    },
    {
      id: "3",
      label: "Reconciliation",
      href: "/accountant/reconciliation",
      icon: RefreshCcw,
      color: "bg-blue-500 text-white hover:bg-blue-600",
    },
    {
      id: "4",
      label: "Audit Logs",
      href: "/accountant/settings",
      icon: FileCheck,
      color: "bg-emerald-500 text-white hover:bg-emerald-600",
    },
  ]

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <a key={action.id} href={action.href}>
              <Button
                className={`w-full h-auto py-4 px-3 rounded-xl flex flex-col items-center gap-2 ${action.color} transition-all duration-200 hover:shadow-md`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            </a>
          )
        })}
      </div>
    </div>
  )
}
