"use client"

import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react"
import { NextAction } from "@/types/accountant/dashboard"

interface NextActionsWidgetProps {
  actions: NextAction[];
}

export default function NextActionsWidget({ actions }: NextActionsWidgetProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-600" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-red-200 bg-red-50/50'
      case 'warning':
        return 'border-amber-200 bg-amber-50/50'
      case 'info':
        return 'border-blue-200 bg-blue-50/50'
      case 'success':
        return 'border-emerald-200 bg-emerald-50/50'
      default:
        return 'border-gray-200 bg-gray-50/50'
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Next Actions</h2>
      <div className="space-y-3">
        {actions.map((action) => (
          <a
            key={action.id}
            href={action.link}
            className={`block p-4 rounded-xl border ${getBorderColor(action.type)} hover:shadow-md transition-all duration-200`}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {getIcon(action.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900">{action.title}</h3>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
