"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import DashboardStats from "@/components/dashboard/stats"
import RecentAnnouncements from "@/components/dashboard/announcements"
import AttendanceChart from "@/components/dashboard/attendance-chart"
import DepartmentDistribution from "@/components/dashboard/department-chart"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-12 w-48 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <DashboardStats language={language} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AttendanceChart language={language} />
              </div>
              <div>
                <DepartmentDistribution language={language} />
              </div>
            </div>
            <div>
              <RecentAnnouncements language={language} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
