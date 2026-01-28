"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Plus, Users, Calendar, MapPin } from "lucide-react"

export default function TrainingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")

  const translations = {
    fr: {
      training: "Gestion des Formations",
      addTraining: "Ajouter une Formation",
      title: "Titre",
      instructor: "Formateur",
      location: "Lieu",
      date: "Date",
      participants: "Participants",
      status: "Statut",
      scheduled: "Planifiée",
      ongoing: "En Cours",
      completed: "Terminée",
      upcomingTrainings: "Formations à Venir",
      startDate: "Date de Début",
      endDate: "Date de Fin",
      maxParticipants: "Max Participants",
    },
    ar: {
      training: "إدارة التدريب",
      addTraining: "إضافة تدريب",
      title: "العنوان",
      instructor: "المدرب",
      location: "الموقع",
      date: "التاريخ",
      participants: "المشاركون",
      status: "الحالة",
      scheduled: "مجدول",
      ongoing: "جاري",
      completed: "منتهي",
      upcomingTrainings: "التدريبات القادمة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      maxParticipants: "الحد الأقصى للمشاركين",
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

  const trainingData = [
    {
      id: 1,
      title: "Formation Next.js",
      instructor: "Expert Tech",
      location: "Bureau Central",
      startDate: "2026-02-15",
      endDate: "2026-02-16",
      participants: 15,
      maxParticipants: 20,
      status: "scheduled",
    },
    {
      id: 2,
      title: "Gestion du Stress",
      instructor: "RH Coach",
      location: "Bureau Central",
      startDate: "2026-02-20",
      endDate: "2026-02-21",
      participants: 18,
      maxParticipants: 25,
      status: "scheduled",
    },
    {
      id: 3,
      title: "Sécurité Incendie",
      instructor: "Expert Sécurité",
      location: "Bureau Central",
      startDate: "2026-02-25",
      endDate: "2026-02-26",
      participants: 12,
      maxParticipants: 20,
      status: "scheduled",
    },
    {
      id: 4,
      title: "RGPD & Conformité",
      instructor: "Consultant Légal",
      location: "Online",
      startDate: "2026-03-01",
      endDate: "2026-03-02",
      participants: 22,
      maxParticipants: 30,
      status: "scheduled",
    },
    {
      id: 5,
      title: "Leadership 101",
      instructor: "Management Coach",
      location: "Bureau Central",
      startDate: "2026-03-10",
      endDate: "2026-03-12",
      participants: 10,
      maxParticipants: 15,
      status: "scheduled",
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
              <h1 className="text-3xl font-bold text-primary">{t.training}</h1>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t.addTraining}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {language === "fr" ? "Formations Planifiées" : "التدريبات المجدولة"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "fr" ? "À venir ce mois" : "القادمة هذا الشهر"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {language === "fr" ? "Participants Totaux" : "إجمالي المشاركين"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">77</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "fr" ? "Inscrits actuellement" : "المسجلون حالياً"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    {language === "fr" ? "Taux de Remplissage" : "معدل الملء"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">81%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "fr" ? "Moyenne de remplissage" : "متوسط الملء"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.upcomingTrainings}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingData.map((training) => (
                    <div key={training.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{training.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{training.instructor}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            training.status === "scheduled"
                              ? "bg-secondary text-secondary-foreground"
                              : training.status === "ongoing"
                                ? "bg-accent text-accent-foreground"
                                : "bg-accent text-accent-foreground"
                          }`}
                        >
                          {training.status === "scheduled"
                            ? t.scheduled
                            : training.status === "ongoing"
                              ? t.ongoing
                              : t.completed}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{training.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{training.startDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {training.participants}/{training.maxParticipants}
                          </span>
                        </div>
                        <div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-accent"
                              style={{
                                width: `${(training.participants / training.maxParticipants) * 100}%`,
                              }}
                            ></div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round((training.participants / training.maxParticipants) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
