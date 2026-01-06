"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Plus } from "lucide-react"

export default function AttendancePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  const translations = {
    fr: {
      attendance: "Gestion de la Présence",
      date: "Date",
      selectDate: "Sélectionner la date",
      checkIn: "Arrivée",
      checkOut: "Départ",
      present: "Présent",
      absent: "Absent",
      late: "Retard",
      recordAttendance: "Enregistrer la Présence",
      todayAttendance: "Présence d'aujourd'hui",
    },
    ar: {
      attendance: "إدارة الحضور",
      date: "التاريخ",
      selectDate: "اختر التاريخ",
      checkIn: "الدخول",
      checkOut: "الخروج",
      present: "حاضر",
      absent: "غائب",
      late: "متأخر",
      recordAttendance: "تسجيل الحضور",
      todayAttendance: "حضور اليوم",
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

  const attendanceData = [
    { id: 1, name: "Ahmed Baye", checkIn: "08:00", checkOut: "17:00", status: "present" },
    { id: 2, name: "Fatima Keita", checkIn: "08:15", checkOut: "17:30", status: "late" },
    { id: 3, name: "Hawa Diop", checkIn: "-", checkOut: "-", status: "absent" },
    { id: 4, name: "Oumar Diallo", checkIn: "07:45", checkOut: "16:45", status: "present" },
    { id: 5, name: "Mariam Meit", checkIn: "08:10", checkOut: "17:15", status: "present" },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">{t.attendance}</h1>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t.recordAttendance}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.selectDate}</CardTitle>
              </CardHeader>
              <CardContent>
                <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.todayAttendance}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold">Nom</th>
                        <th className="text-left p-3 font-semibold">{t.checkIn}</th>
                        <th className="text-left p-3 font-semibold">{t.checkOut}</th>
                        <th className="text-left p-3 font-semibold">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((record) => (
                        <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3 font-medium">{record.name}</td>
                          <td className="p-3">{record.checkIn}</td>
                          <td className="p-3">{record.checkOut}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                record.status === "present"
                                  ? "bg-accent text-accent-foreground"
                                  : record.status === "late"
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-destructive/20 text-destructive"
                              }`}
                            >
                              {record.status === "present" ? t.present : record.status === "late" ? t.late : t.absent}
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
