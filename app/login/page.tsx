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
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setLanguage("fr")}
          className={`px-3 py-1 rounded ${language === "fr" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          FR
        </button>
        <button
          onClick={() => setLanguage("ar")}
          className={`px-3 py-1 rounded ${language === "ar" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          AR
        </button>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-primary">{t.title}</CardTitle>
          <CardDescription className="text-center">{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.email}</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t.password}</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.loading}
                </>
              ) : (
                t.login
              )}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">{language === "fr" ? "Compte de test:" : "حساب الاختبار:"}</p>
            <p className="text-xs text-muted-foreground mt-1">admin@example.com / password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
