"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, FileText, Sparkles, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { summarizeCandidateCV } from "@/app/recruitment/actions"
import { toast } from "sonner"

interface Candidate {
    id: number
    first_name: string
    last_name: string
    email: string
    phone: string
    status: string
    cv_url?: string
    created_at: string
}

interface CandidateListProps {
    candidates: Candidate[]
    language: "fr" | "ar"
}

export default function CandidateList({ candidates, language }: CandidateListProps) {
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
    const [summary, setSummary] = useState<string>("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const translations = {
        fr: {
            noCandidates: "Aucun candidat pour le moment",
            new: "Nouveau",
            inReview: "En Examen",
            shortlisted: "Présélectionné",
            rejected: "Rejeté",
            hired: "Embauché",
            viewCV: "Voir CV",
            aiSummary: "Résumé IA",
            generating: "Génération du résumé...",
            close: "Fermer",
            error: "Erreur lors de la génération",
        },
        ar: {
            noCandidates: "لا يوجد مرشحون حتى الآن",
            new: "جديد",
            inReview: "قيد المراجعة",
            shortlisted: "مرشح",
            rejected: "مرفوض",
            hired: "معين",
            viewCV: "عرض السيرة الذاتية",
            aiSummary: "ملخص الذكاء الاصطناعي",
            generating: "جاري إنشاء الملخص...",
            close: "إغلاق",
            error: "خطأ أثناء الإنشاء",
        },
    }

    const t = translations[language]

    const getStatusLabel = (status: string) => {
        const statusMap: Record<string, string> = {
            new: t.new,
            inReview: t.inReview,
            shortlisted: t.shortlisted,
            rejected: t.rejected,
            hired: t.hired,
        }
        return statusMap[status] || status
    }

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        const variantMap: Record<string, any> = {
            new: "secondary",
            inReview: "default",
            shortlisted: "default",
            rejected: "destructive",
            hired: "outline",
        }
        return variantMap[status] || "secondary"
    }

    const handleSummarize = async (candidate: Candidate) => {
        setIsGenerating(true)
        setSelectedCandidate(candidate)
        setIsDialogOpen(true)
        setSummary("")

        try {
            const result = await summarizeCandidateCV(candidate.id)
            if (result.success) {
                setSummary(result.data as string)
            } else {
                toast.error(result.error || t.error)
                setIsDialogOpen(false)
            }
        } catch (error) {
            console.error("AI summary error:", error)
            toast.error(t.error)
            setIsDialogOpen(false)
        } finally {
            setIsGenerating(false)
        }
    }

    if (candidates.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>{t.noCandidates}</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-3">
                {candidates.map((candidate) => (
                    <Card key={candidate.id}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold">
                                            {candidate.first_name} {candidate.last_name}
                                        </h3>
                                        <Badge variant={getStatusVariant(candidate.status)}>{getStatusLabel(candidate.status)}</Badge>
                                    </div>

                                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            <a href={`mailto:${candidate.email}`} className="hover:text-primary">
                                                {candidate.email}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            <a href={`tel:${candidate.phone}`} className="hover:text-primary">
                                                {candidate.phone}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {candidate.cv_url && (
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4" />
                                                    <a
                                                        href={candidate.cv_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:text-primary font-medium"
                                                    >
                                                        {t.viewCV}
                                                    </a>
                                                </div>
                                            )}

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-7 px-2 text-primary hover:text-primary hover:bg-primary/10"
                                                onClick={() => handleSummarize(candidate)}
                                            >
                                                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                                {t.aiSummary}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            {t.aiSummary}: {selectedCandidate?.first_name} {selectedCandidate?.last_name}
                        </DialogTitle>
                        <DialogDescription>
                            Analyse assistée par Intelligence Artificielle
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center py-8 space-y-4">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">{t.generating}</p>
                            </div>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <div className="p-4 rounded-lg bg-muted/50 whitespace-pre-wrap leading-relaxed">
                                    {summary}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
