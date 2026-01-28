"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, BarChart3, Clock, DollarSign, BookOpen, Briefcase, Settings } from "lucide-react"

interface DashboardSidebarProps {
  language: "fr" | "ar"
  user?: any
}

export default function DashboardSidebar({ language }: DashboardSidebarProps) {
  const pathname = usePathname()

  const translations = {
    fr: {
      dashboard: "Tableau de Bord",
      employees: "Employés",
      attendance: "Présence",
      leave: "Congés",
      payroll: "Paie",
      training: "Formations",
      recruitment: "Recrutement",
      settings: "Paramètres",
    },
    ar: {
      dashboard: "لوحة التحكم",
      employees: "الموظفون",
      attendance: "الحضور",
      leave: "الإجازات",
      payroll: "الرواتب",
      training: "التدريب",
      recruitment: "التوظيف",
      settings: "الإعدادات",
    },
  }

  const t = translations[language]

  const menuItems = [
    { href: "/dashboard", label: t.dashboard, icon: BarChart3 },
    { href: "/employees", label: t.employees, icon: Users },
    { href: "/attendance", label: t.attendance, icon: Clock },
    { href: "/leave", label: t.leave, icon: BookOpen },
    { href: "/payroll", label: t.payroll, icon: DollarSign },
    { href: "/training", label: t.training, icon: BookOpen },
    { href: "/recruitment", label: t.recruitment, icon: Briefcase },
    { href: "/settings", label: t.settings, icon: Settings },
  ]

  return (
    <aside className="hidden lg:flex w-72 bg-sidebar flex-col relative z-20">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
            <span className="text-sidebar text-2xl font-black">G</span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-black text-sidebar-foreground text-xl tracking-tight leading-none mb-1">
              {language === "fr" ? "GRH System" : "نظام الموارد"}
            </h2>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Management Elite</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 scrollbar-hide">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] px-4 mb-4">
          {language === "fr" ? "Menu Principal" : "القائمة الرئيسية"}
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                  ? "bg-white text-sidebar shadow-xl shadow-black/10 scale-[1.02]"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-sidebar" : ""}`} />
              <span className="font-bold tracking-tight text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-sidebar rounded-full animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Support</p>
          <p className="text-xs text-white/80 font-medium mb-3">
            {language === "fr" ? "Besoin d'aide avec l'administration ?" : "بحاجة للمساعدة في الإدارة؟"}
          </p>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors">
            {language === "fr" ? "Contacter Support" : "اتصل بالدعم"}
          </button>
        </div>
      </div>
    </aside>
  )
}
