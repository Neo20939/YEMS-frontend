"use client"

import AccountantSidebar from "@/components/accountant/AccountantSidebar"
import { UserProvider } from "@/contexts/UserContext"

export default function AccountantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <AccountantSidebar />
        <div className="ml-20 transition-all duration-300">
          {children}
        </div>
      </div>
    </UserProvider>
  )
}
