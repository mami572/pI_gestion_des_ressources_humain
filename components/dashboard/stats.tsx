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
    { icon: Users, label: t.totalEmployees, value: stats?.totalEmployees || 0 },
    { icon: CheckCircle2, label: t.presentToday, value: stats?.presentToday || 0 },
    { icon: Clock, label: t.pendingLeaves, value: stats?.pendingLeaves || 0 },
    { icon: BookOpen, label: t.completedTrainings, value: stats?.completedTrainings || 0 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
