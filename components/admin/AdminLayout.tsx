"use client"

import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar />
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        <AdminHeader />
        <main className="p-8 overflow-y-auto">{children}</main>
        <footer className="p-8 mt-auto text-center border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
          <p className="text-sm text-slate-500">
            © 2024 Yesua Educational Platform. All rights reserved. Built for higher education excellence.
          </p>
        </footer>
      </div>
    </div>
  )
}
