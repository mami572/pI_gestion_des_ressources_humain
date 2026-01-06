"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu } from "lucide-react"
import { useState } from "react"

interface DashboardHeaderProps {
  language: "fr" | "ar"
  user?: any
  setLanguage?: (lang: "fr" | "ar") => void
}

export default function DashboardHeader({ language, user, setLanguage }: DashboardHeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const translations = {
    fr: {
      logout: "Déconnexion",
      profile: "Profil",
    },
    ar: {
      logout: "تسجيل الخروج",
      profile: "الملف الشخصي",
    },
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-primary">{language === "fr" ? "GRH" : "نظام الموارد البشرية"}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage?.("fr")}
            className={`px-3 py-1 rounded text-sm ${language === "fr" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage?.("ar")}
            className={`px-3 py-1 rounded text-sm ${language === "ar" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            AR
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="font-medium text-sm">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">{translations[language].logout}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
