import { StatCardProps } from "@/types/admin"

export default function StatCard({ title, value, subtext, icon, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
    sage: "bg-sage/10 text-sage",
  }

  return (
    <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 flex items-center gap-5 shadow-sm">
      <div className={`size-14 rounded-2xl flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
        {subtext && (
          <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${
            subtext.includes("+") ? "text-emerald-600" : 
            subtext.includes("!") ? "text-rose-600" : 
            "text-slate-400"
          }`}>
            {subtext.includes("trending") && (
              <span className="material-symbols-outlined text-xs">trending_up</span>
            )}
            {subtext.includes("priority") && (
              <span className="material-symbols-outlined text-xs">priority_high</span>
            )}
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

export function StatsGrid() {
  const stats = [
    {
      title: "Total Platform Users",
      value: "12,482",
      subtext: "+4.2% from last month",
      icon: "group",
      color: "primary",
    },
    {
      title: "Active System Roles",
      value: "14",
      subtext: "2 customized roles added",
      icon: "verified_user",
      color: "amber",
    },
    {
      title: "Pending Requests",
      value: "28",
      subtext: "! 12 high priority",
      icon: "pending_actions",
      color: "rose",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
