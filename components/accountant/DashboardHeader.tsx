"use client"

import { Bell, Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AccountantDashboardHeader() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Title and Date */}
          <div>
            <h1 className="text-2xl font-bold text-primary">Financial Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{currentDate}</span>
            </div>
          </div>

          {/* Right side - Search and Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search student, invoice..."
                className="h-10 pl-10 pr-4 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <Button variant="outline" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                5
              </span>
            </Button>

            {/* Help */}
            <Button variant="outline" size="default">
              Help
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
