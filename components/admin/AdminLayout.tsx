"use client"

import AdminSidebar from "./AdminSidebar"
import AdminHeader from "./AdminHeader"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <AdminSidebar />
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-8 overflow-auto max-w-[1800px] w-full">{children}</main>
        <footer className="sticky bottom-0 p-4 text-center border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 z-10">
          <p className="text-sm text-slate-500">
            © 2024 Yesua Educational Platform. All rights reserved. Built for higher education excellence.
          </p>
        </footer>
      </div>
    </div>
  )
}
