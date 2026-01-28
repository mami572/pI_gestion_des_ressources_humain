"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, Search, Bell, Settings } from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

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
      search: "Rechercher...",
    },
    ar: {
      logout: "تسجيل الخروج",
      profile: "الملف الشخصي",
      search: "بحث...",
    },
  }

  const t = translations[language]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 glass border-b border-white/20 px-6 py-4 shadow-sm bg-background/60">
      <div className="flex items-center gap-4 lg:gap-8 flex-1">
        <button className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden lg:flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="text-primary-foreground font-bold">G</span>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground hidden xl:block">
            {language === "fr" ? "Administration GRH" : "إدارة الموارد"}
          </h1>
        </div>

        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            className="pl-10 h-11 bg-white/50 border-white/30 rounded-full focus:bg-white transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="hidden sm:flex items-center gap-1 p-1 bg-muted/50 rounded-full border border-border">
          <button
            onClick={() => setLanguage?.("fr")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === "fr" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
          >
            FR
          </button>
          <button
            onClick={() => setLanguage?.("ar")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === "ar" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted"}`}
          >
            AR
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary active:scale-95 transition-all">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-[10px] border-2 border-background">3</Badge>
          </Button>

          <div className="h-10 w-[1px] bg-border mx-2 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div className="text-right hidden xl:block">
              <p className="font-bold text-sm leading-tight">{user?.email?.split('@')[0]}</p>
              <Badge variant="secondary" className="px-2 py-0 h-4 text-[10px] uppercase font-bold tracking-tighter bg-accent/10 text-accent border-accent/20">
                {user?.role}
              </Badge>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px] cursor-pointer hover:shadow-lg transition-shadow">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-sm text-primary">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout} className="h-10 w-10 rounded-full text-destructive hover:bg-destructive/10">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
