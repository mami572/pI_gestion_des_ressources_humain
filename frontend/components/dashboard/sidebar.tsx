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
    <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h2 className="font-bold text-sidebar-foreground text-lg">
          {language === "fr" ? "GRH System" : "نظام الموارد البشرية"}
        </h2>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
