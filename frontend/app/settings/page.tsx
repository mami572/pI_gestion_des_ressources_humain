"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")
  const [settings, setSettings] = useState({
    company_name: "Ma Société",
    timezone: "Africa/Nouakchott",
    currency: "MRU",
  })

  const translations = {
    fr: {
      settings: "Paramètres",
      companyInfo: "Informations de l'Entreprise",
      companyName: "Nom de l'Entreprise",
      timezone: "Fuseau Horaire",
      currency: "Devise",
      save: "Enregistrer",
      cancel: "Annuler",
      systemSettings: "Paramètres du Système",
      language: "Langue",
    },
    ar: {
      settings: "الإعدادات",
      companyInfo: "معلومات الشركة",
      companyName: "اسم الشركة",
      timezone: "المنطقة الزمنية",
      currency: "العملة",
      save: "حفظ",
      cancel: "إلغاء",
      systemSettings: "إعدادات النظام",
      language: "اللغة",
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

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-primary">{t.settings}</h1>

            <Card>
              <CardHeader>
                <CardTitle>{t.companyInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.companyName}</Label>
                  <Input
                    value={settings.company_name}
                    onChange={(e) => setSettings({ ...settings, company_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t.timezone}</Label>
                  <Input value={settings.timezone} />
                </div>

                <div className="space-y-2">
                  <Label>{t.currency}</Label>
                  <Input value={settings.currency} />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button className="bg-primary hover:bg-primary/90">{t.save}</Button>
                  <Button variant="outline">{t.cancel}</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.systemSettings}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded">
                    <div>
                      <p className="font-medium">{t.language}</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "fr" ? "Français / عربي" : "عربي / Français"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLanguage("fr")}
                        className={`px-3 py-1 rounded text-sm ${language === "fr" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        FR
                      </button>
                      <button
                        onClick={() => setLanguage("ar")}
                        className={`px-3 py-1 rounded text-sm ${language === "ar" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        AR
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
