"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, FileText } from "lucide-react"

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
    const translations = {
        fr: {
            noCandidates: "Aucun candidat pour le moment",
            new: "Nouveau",
            inReview: "En Examen",
            shortlisted: "Présélectionné",
            rejected: "Rejeté",
            hired: "Embauché",
            viewCV: "Voir CV",
        },
        ar: {
            noCandidates: "لا يوجد مرشحون حتى الآن",
            new: "جديد",
            inReview: "قيد المراجعة",
            shortlisted: "مرشح",
            rejected: "مرفوض",
            hired: "معين",
            viewCV: "عرض السيرة الذاتية",
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

    if (candidates.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p>{t.noCandidates}</p>
            </div>
        )
    }

    return (
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

                                    {candidate.cv_url && (
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            <a
                                                href={candidate.cv_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-primary"
                                            >
                                                {t.viewCV}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
