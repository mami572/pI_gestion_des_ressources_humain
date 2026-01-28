"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getAIWorkforceInsights } from "@/app/dashboard/actions"

interface AIInsightsProps {
    language: "fr" | "ar"
}

export default function AIInsights({ language }: AIInsightsProps) {
    const [insights, setInsights] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const translations = {
        fr: {
            title: "Analyse Stratégique IA",
            description: "Aperçu de la main-d'œuvre assisté par IA",
            refresh: "Actualiser",
            loading: "Analyse en cours...",
            error: "Impossible de générer l'analyse",
        },
        ar: {
            title: "تحليل استراتيجي بالذكاء الاصطناعي",
            description: "نظرة عامة على القوى العاملة بمساعدة الذكاء الاصطناعي",
            refresh: "تحديث",
            loading: "جاري التحليل...",
            error: "فشل إنشاء التحليل",
        },
    }

    const t = translations[language]

    const loadInsights = async () => {
        setLoading(true)
        setError(null)
        try {
            const result = await getAIWorkforceInsights()
            if (result.success) {
                setInsights(result.data as string)
            } else {
                setError(result.error || t.error)
            }
        } catch (err) {
            setError(t.error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadInsights()
    }, [])

    return (
        <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        {t.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={loadInsights} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">{t.loading}</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-destructive">
                        <AlertCircle className="h-8 w-8" />
                        <p className="text-sm font-medium">{error}</p>
                        <Button variant="outline" size="sm" onClick={loadInsights}>Ressayer</Button>
                    </div>
                ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="rounded-lg border bg-background/50 p-4 whitespace-pre-wrap leading-relaxed shadow-sm">
                            {insights}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
