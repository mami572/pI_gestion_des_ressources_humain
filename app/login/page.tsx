"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")

  const translations = {
    fr: {
      title: "Gestion des Ressources Humaines",
      subtitle: "Connectez-vous à votre compte",
      email: "Adresse Email",
      password: "Mot de Passe",
      login: "Se connecter",
      invalidCredentials: "Email ou mot de passe invalide",
      error: "Une erreur est survenue",
      loading: "Connexion en cours...",
    },
    ar: {
      title: "إدارة الموارد البشرية",
      subtitle: "تسجيل الدخول إلى حسابك",
      email: "عنوان البريد الإلكتروني",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      invalidCredentials: "بريد إلكتروني أو كلمة مرور غير صحيحة",
      error: "حدث خطأ ما",
      loading: "جاري تسجيل الدخول...",
    },
  }

  const t = translations[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || t.error)
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError(t.error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-accent/10 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={() => setLanguage("fr")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${language === "fr" ? "bg-primary text-primary-foreground shadow-lg scale-105" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
        >
          FR
        </button>
        <button
          onClick={() => setLanguage("ar")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${language === "ar" ? "bg-primary text-primary-foreground shadow-lg scale-105" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
        >
          AR
        </button>
      </div>

      <Card className="w-full max-w-md glass-card border-white/20 select-none relative z-10 animate-in fade-in zoom-in duration-700">
        <CardHeader className="space-y-2 pb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl shadow-primary/20 animate-float">
            <span className="text-primary-foreground text-3xl font-bold">G</span>
          </div>
          <CardTitle className="text-3xl font-bold text-center tracking-tight text-foreground">{t.title}</CardTitle>
          <CardDescription className="text-center text-muted-foreground/80 font-medium">{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex gap-2 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 animate-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">{t.email}</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/50 dark:bg-black/20 border-white/30 rounded-xl h-12 transition-all focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">{t.password}</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                className="bg-white/50 dark:bg-black/20 border-white/30 rounded-xl h-12 transition-all focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t.loading}
                </>
              ) : (
                t.login
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <div className="bg-muted/30 rounded-lg p-3 inline-block">
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1 leading-none">{language === "fr" ? "Compte de test" : "حساب الاختبار"}</p>
              <p className="text-sm font-mono text-primary/80">admin@example.com / password</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
