"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createJobOffer } from "../actions"
import { toast } from "sonner"
import { useEffect } from "react"

export default function AddJobOfferPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [language, setLanguage] = useState<"fr" | "ar">("fr")
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        department: "",
        location: "Nouakchott",
        type: "CDI",
        description: "",
    })

    const translations = {
        fr: {
            addOffer: "Ajouter une Offre d'Emploi",
            title: "Titre du poste",
            titlePlaceholder: "Ex: Développeur Full Stack",
            department: "Département",
            departmentPlaceholder: "Ex: Informatique",
            location: "Lieu",
            locationPlaceholder: "Ex: Nouakchott",
            type: "Type de contrat",
            description: "Description du poste",
            descriptionPlaceholder: "Décrivez les responsabilités, qualifications requises...",
            cancel: "Annuler",
            submit: "Créer l'offre",
            creating: "Création...",
            success: "Offre créée avec succès",
        },
        ar: {
            addOffer: "إضافة عرض عمل",
            title: "المسمى الوظيفي",
            titlePlaceholder: "مثال: مطور فول ستاك",
            department: "الإدارة",
            departmentPlaceholder: "مثال: تكنولوجيا المعلومات",
            location: "الموقع",
            locationPlaceholder: "مثال: نواكشوط",
            type: "نوع العقد",
            description: "وصف الوظيفة",
            descriptionPlaceholder: "صف المسؤوليات والمؤهلات المطلوبة...",
            cancel: "إلغاء",
            submit: "إنشاء العرض",
            creating: "جاري الإنشاء...",
            success: "تم إنشاء العرض بنجاح",
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await createJobOffer(formData)

            if (result.success) {
                toast.success(result.message || t.success)
                router.push("/recruitment")
            } else {
                toast.error(result.error || "Erreur lors de la création")
            }
        } catch (error) {
            console.error("Error creating job offer:", error)
            toast.error("Erreur lors de la création")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen bg-background">
            <DashboardSidebar language={language} user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
                <main className="flex-1 overflow-auto p-6">
                    <div className="max-w-3xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <h1 className="text-3xl font-bold text-primary">{t.addOffer}</h1>
                        </div>

                        {/* Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{t.addOffer}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">{t.title}</Label>
                                        <Input
                                            id="title"
                                            placeholder={t.titlePlaceholder}
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* Department */}
                                    <div className="space-y-2">
                                        <Label htmlFor="department">{t.department}</Label>
                                        <Input
                                            id="department"
                                            placeholder={t.departmentPlaceholder}
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location">{t.location}</Label>
                                        <Input
                                            id="location"
                                            placeholder={t.locationPlaceholder}
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label htmlFor="type">{t.type}</Label>
                                        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CDI">CDI</SelectItem>
                                                <SelectItem value="CDD">CDD</SelectItem>
                                                <SelectItem value="Stage">Stage</SelectItem>
                                                <SelectItem value="Freelance">Freelance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">{t.description}</Label>
                                        <Textarea
                                            id="description"
                                            placeholder={t.descriptionPlaceholder}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={8}
                                            required
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 justify-end">
                                        <Button type="button" variant="outline" onClick={() => router.back()}>
                                            {t.cancel}
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    {t.creating}
                                                </>
                                            ) : (
                                                t.submit
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}
