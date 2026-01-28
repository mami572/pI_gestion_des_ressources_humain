"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Plus } from "lucide-react"

export default function LeavePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")

  const translations = {
    fr: {
      leave: "Gestion des Congés",
      requestLeave: "Demander un Congé",
      employee: "Employé",
      type: "Type",
      startDate: "Date Début",
      endDate: "Date Fin",
      days: "Jours",
      status: "Statut",
      pending: "En Attente",
      approved: "Approuvé",
      rejected: "Rejeté",
    },
    ar: {
      leave: "إدارة الإجازات",
      requestLeave: "طلب إجازة",
      employee: "الموظف",
      type: "نوع",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      days: "أيام",
      status: "الحالة",
      pending: "معلق",
      approved: "موافق عليه",
      rejected: "مرفوض",
    },
  }

  const t = translations[language]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) router.push("/login")
        else setUser(await response.json())
      } catch {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const leaveData = [
    {
      id: 1,
      employee: "Ahmed Baye",
      type: "Congé Annuel",
      startDate: "2026-02-01",
      endDate: "2026-02-10",
      days: 10,
      status: "pending",
    },
    {
      id: 2,
      employee: "Fatima Keita",
      type: "Congé Maladie",
      startDate: "2026-01-15",
      endDate: "2026-01-20",
      days: 5,
      status: "approved",
    },
    {
      id: 3,
      employee: "Oumar Diallo",
      type: "Congé Parental",
      startDate: "2026-03-01",
      endDate: "2026-06-01",
      days: 90,
      status: "pending",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">{t.leave}</h1>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t.requestLeave}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Demandes de Congé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold">{t.employee}</th>
                        <th className="text-left p-3 font-semibold">{t.type}</th>
                        <th className="text-left p-3 font-semibold">{t.startDate}</th>
                        <th className="text-left p-3 font-semibold">{t.endDate}</th>
                        <th className="text-left p-3 font-semibold">{t.days}</th>
                        <th className="text-left p-3 font-semibold">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveData.map((request) => (
                        <tr key={request.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3 font-medium">{request.employee}</td>
                          <td className="p-3">{request.type}</td>
                          <td className="p-3">{request.startDate}</td>
                          <td className="p-3">{request.endDate}</td>
                          <td className="p-3">{request.days}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                request.status === "pending"
                                  ? "bg-secondary text-secondary-foreground"
                                  : request.status === "approved"
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-destructive/20 text-destructive"
                              }`}
                            >
                              {request.status === "pending"
                                ? t.pending
                                : request.status === "approved"
                                  ? t.approved
                                  : t.rejected}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
