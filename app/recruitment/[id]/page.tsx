"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import CandidateList from "@/components/recruitment/candidate-list"
import DeleteOfferDialog from "@/components/recruitment/delete-offer-dialog"
import { ArrowLeft, Edit, XCircle, Trash2, MapPin, Briefcase, Calendar } from "lucide-react"
import { getJobOfferById, getCandidatesByOffer, closeJobOffer, deleteJobOffer } from "../actions"
import { toast } from "sonner"

export default function JobOfferDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [language, setLanguage] = useState<"fr" | "ar">("fr")
    const [offer, setOffer] = useState<any>(null)
    const [candidates, setCandidates] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [deleteDialog, setDeleteDialog] = useState(false)

    const offerId = parseInt(params.id as string)

    const translations = {
        fr: {
            details: "Détails de l'offre",
            description: "Description",
            candidates: "Candidats",
            edit: "Modifier",
            close: "Fermer l'offre",
            delete: "Supprimer",
            open: "Ouverte",
            closed: "Fermée",
            loading: "Chargement...",
            notFound: "Offre non trouvée",
            closeSuccess: "Offre fermée avec succès",
            deleteSuccess: "Offre supprimée avec succès",
            error: "Une erreur s'est produite",
            postedOn: "Publié le",
        },
        ar: {
            details: "تفاصيل العرض",
            description: "الوصف",
            candidates: "المرشحون",
            edit: "تعديل",
            close: "إغلاق العرض",
            delete: "حذف",
            open: "مفتوحة",
            closed: "مغلقة",
            loading: "جاري التحميل...",
            notFound: "العرض غير موجود",
            closeSuccess: "تم إغلاق العرض بنجاح",
            deleteSuccess: "تم حذف العرض بنجاح",
            error: "حدث خطأ",
            postedOn: "نشر في",
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

    useEffect(() => {
        loadData()
    }, [offerId])

    const loadData = async () => {
        setLoading(true)
        try {
            const [offerResult, candidatesResult] = await Promise.all([
                getJobOfferById(offerId),
                getCandidatesByOffer(offerId),
            ])

            if (offerResult.success) {
                setOffer(offerResult.data)
            } else {
                toast.error(offerResult.error || t.error)
            }

            if (candidatesResult.success) {
                setCandidates(candidatesResult.data as any[])
            }
        } catch (error) {
            console.error("Error loading data:", error)
            toast.error(t.error)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = async () => {
        try {
            const result = await closeJobOffer(offerId)
            if (result.success) {
                toast.success(t.closeSuccess)
                loadData()
            } else {
                toast.error(result.error || t.error)
            }
        } catch (error) {
            console.error("Error closing offer:", error)
            toast.error(t.error)
        }
    }

    const handleDelete = async (force: boolean) => {
        try {
            const result = await deleteJobOffer(offerId, force)
            if (result.success) {
                toast.success(t.deleteSuccess)
                router.push("/recruitment")
            } else {
                if (result.requiresConfirmation) {
                    return // Keep dialog open
                }
                toast.error(result.error || t.error)
                setDeleteDialog(false)
            }
        } catch (error) {
            console.error("Error deleting offer:", error)
            toast.error(t.error)
            setDeleteDialog(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-background">
                <DashboardSidebar language={language} user={user} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
                    <main className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">{t.loading}</p>
                    </main>
                </div>
            </div>
        )
    }

    if (!offer) {
        return (
            <div className="flex h-screen bg-background">
                <DashboardSidebar language={language} user={user} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
                    <main className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">{t.notFound}</p>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-background">
            <DashboardSidebar language={language} user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-5xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <Button variant="ghost" size="icon" onClick={() => router.push("/recruitment")}>
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-3xl font-bold text-primary">{offer.title}</h1>
                                        <Badge variant={offer.status === "open" ? "default" : "secondary"}>
                                            {offer.status === "open" ? t.open : t.closed}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground mt-1">{offer.department}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => router.push(`/recruitment/${offerId}/edit`)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    {t.edit}
                                </Button>
                                {offer.status === "open" && (
                                    <Button variant="outline" onClick={handleClose} className="text-orange-600">
                                        <XCircle className="h-4 w-4 mr-2" />
                                        {t.close}
                                    </Button>
                                )}
                                <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t.delete}
                                </Button>
                            </div>
                        </div>

                        {/* Details Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.details}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {offer.location}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        {offer.type}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {t.postedOn} {new Date(offer.created_at).toLocaleDateString(language === "fr" ? "fr-FR" : "ar")}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-semibold mb-2">{t.description}</h3>
                                    <p className="text-muted-foreground whitespace-pre-wrap">{offer.description}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Candidates Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t.candidates} ({candidates.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CandidateList candidates={candidates} language={language} />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>

            {/* Delete Dialog */}
            <DeleteOfferDialog
                open={deleteDialog}
                onOpenChange={setDeleteDialog}
                onConfirm={handleDelete}
                candidateCount={candidates.length}
                language={language}
            />
        </div>
    )
}
