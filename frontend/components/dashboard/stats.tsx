"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle2, Clock, BookOpen } from "lucide-react"

interface DashboardStatsProps {
  language: "fr" | "ar"
}

export default function DashboardStats({ language }: DashboardStatsProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const translations = {
    fr: {
      totalEmployees: "Total Employés",
      presentToday: "Présents Aujourd'hui",
      pendingLeaves: "Congés en Attente",
      completedTrainings: "Formations Terminées",
    },
    ar: {
      totalEmployees: "إجمالي الموظفين",
      presentToday: "حاضرون اليوم",
      pendingLeaves: "الإجازات المعلقة",
      completedTrainings: "التدريبات المكتملة",
    },
  }

  const t = translations[language]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats")
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      icon: Users,
      label: t.totalEmployees,
      value: stats?.totalEmployees || 0,
      color: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-500"
    },
    {
      icon: CheckCircle2,
      label: t.presentToday,
      value: stats?.presentToday || 0,
      color: "from-emerald-500/20 to-emerald-600/20",
      iconColor: "text-emerald-500"
    },
    {
      icon: Clock,
      label: t.pendingLeaves,
      value: stats?.pendingLeaves || 0,
      color: "from-amber-500/20 to-amber-600/20",
      iconColor: "text-amber-500"
    },
    {
      icon: BookOpen,
      label: t.completedTrainings,
      value: stats?.completedTrainings || 0,
      color: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-500"
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="glass-card border-none overflow-hidden relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color.split(' ')[0].replace('/20', '/10')} bg-white/50 backdrop-blur-sm`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-extrabold tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="text-emerald-500 font-bold">↑ 12%</span>
                  {language === "fr" ? "vs mois dernier" : "مقابل الشهر الماضي"}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Special Night Chef / Administration Indicator */}
      <div className="glass-card premium-gradient text-primary-foreground p-1 shadow-2xl shadow-primary/20">
        <div className="bg-background/10 backdrop-blur-xl rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{language === "fr" ? "Statut de l'Administration" : "حالة الإدارة"}</h3>
              <p className="text-sm text-white/70">
                {language === "fr" ? "Shift Actuel: Chef de Nuit (22h - 06h)" : "الوردية الحالية: مدير ليلي (10 مساءً - 6 صباحًا)"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              {language === "fr" ? "SYSTÈME ACTIF" : "النظام نشط"}
            </div>
            <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-sm font-bold">
              {new Date().toLocaleTimeString(language === "fr" ? "fr-FR" : "ar-SA", { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
