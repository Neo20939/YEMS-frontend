"use client"

export default function DashboardFooter() {
  return (
    <footer className="mt-auto py-8 px-6 border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>© 2024 Educational Excellence Platform.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="hover:text-primary transition-colors font-medium" href="#">
            Help Center
          </a>
          <a className="hover:text-primary transition-colors font-medium" href="#">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  )
}
