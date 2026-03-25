"use client"

import { DollarSign, Users, TrendingUp } from "lucide-react"
import { ClassFeeSummary } from "@/types/accountant"
import { Button } from "@/components/ui/button"

interface FeeManagementSectionProps {
  classSummaries: ClassFeeSummary[];
}

export default function FeeManagementSection({ classSummaries }: FeeManagementSectionProps) {
  const formatCurrency = (amount: number) => {
    return `₦${(amount / 1000000).toFixed(2)}M`
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Fee Collection by Class</h2>
          <p className="text-sm text-gray-500 mt-1">Real-time collection status across all classes</p>
        </div>
        <Button variant="default" size="sm">
          View All
        </Button>
      </div>

      <div className="space-y-5">
        {classSummaries.map((summary) => (
          <div key={summary.class} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{summary.class}</h3>
                  <p className="text-xs text-gray-500">{summary.paidCount} of {summary.studentCount} students paid</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{formatCurrency(summary.totalCollected)}</p>
                <p className="text-xs text-gray-500">of {formatCurrency(summary.totalBilled)}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-500"
                style={{ width: `${summary.collectionPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 font-medium">
                  {summary.collectionPercentage.toFixed(0)}% collected
                </span>
                <span className="text-amber-600 font-medium">
                  {formatCurrency(summary.totalOutstanding)} outstanding
                </span>
              </div>
              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-3 h-3" />
                <span>{summary.studentCount} students</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-gray-700">Overall Collection Rate</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">
              {(classSummaries.reduce((acc, curr) => acc + curr.collectionPercentage, 0) / classSummaries.length).toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500">
              Total: ₦{(classSummaries.reduce((acc, curr) => acc + curr.totalCollected, 0) / 1000000).toFixed(2)}M collected
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
