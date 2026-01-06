"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import JobOfferCard from "@/components/recruitment/job-offer-card"
import JobOfferFilters from "@/components/recruitment/job-offer-filters"
import DeleteOfferDialog from "@/components/recruitment/delete-offer-dialog"
import { Plus } from "lucide-react"
import { getJobOffers, getDepartments, closeJobOffer, deleteJobOffer } from "./actions"
import { toast } from "sonner"

export default function RecruitmentPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")
  const [jobOffers, setJobOffers] = useState<any[]>([])
  const [departments, setDepartments] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; offerId?: number; candidateCount?: number }>({
    open: false,
  })

  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
    search: "",
  })

  const translations = {
    fr: {
      recruitment: "Recrutement",
      addOffer: "Ajouter une Offre",
      noOffers: "Aucune offre d'emploi disponible",
      loading: "Chargement...",
      closeSuccess: "Offre fermée avec succès",
      deleteSuccess: "Offre supprimée avec succès",
      error: "Une erreur s'est produite",
    },
    ar: {
      recruitment: "التوظيف",
      addOffer: "إضافة عرض",
      noOffers: "لا توجد عروض عمل متاحة",
      loading: "جاري التحميل...",
      closeSuccess: "تم إغلاق العرض بنجاح",
      deleteSuccess: "تم حذف العرض بنجاح",
      error: "حدث خطأ",
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
  }, [filters])

  const loadData = async () => {
    setLoading(true)
    try {
      const [offersResult, deptsResult] = await Promise.all([getJobOffers(filters), getDepartments()])

      if (offersResult.success) {
        setJobOffers(offersResult.data as any[])
      } else {
        toast.error(offersResult.error || t.error)
      }

      if (deptsResult.success) {
        setDepartments((deptsResult.data as any[]).map((d: any) => d.department))
      }
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error(t.error)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseOffer = async (id: number) => {
    try {
      const result = await closeJobOffer(id)
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

  const handleDeleteOffer = (id: number) => {
    const offer = jobOffers.find((o) => o.id === id)
    setDeleteDialog({
      open: true,
      offerId: id,
      candidateCount: offer?.candidate_count || 0,
    })
  }

  const confirmDelete = async (force: boolean) => {
    if (!deleteDialog.offerId) return

    try {
      const result = await deleteJobOffer(deleteDialog.offerId, force)

      if (result.success) {
        toast.success(t.deleteSuccess)
        setDeleteDialog({ open: false })
        loadData()
      } else {
        if (result.requiresConfirmation) {
          // Already showing confirmation dialog, just keep it open
          return
        }
        toast.error(result.error || t.error)
        setDeleteDialog({ open: false })
      }
    } catch (error) {
      console.error("Error deleting offer:", error)
      toast.error(t.error)
      setDeleteDialog({ open: false })
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">{t.recruitment}</h1>
              <Button className="bg-primary hover:bg-primary/90" onClick={() => router.push("/recruitment/add")}>
                <Plus className="h-4 w-4 mr-2" />
                {t.addOffer}
              </Button>
            </div>

            {/* Filters */}
            <JobOfferFilters
              language={language}
              filters={filters}
              departments={departments}
              onFiltersChange={setFilters}
            />

            {/* Job Offers Grid */}
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">{t.loading}</div>
            ) : jobOffers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">{t.noOffers}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobOffers.map((offer) => (
                  <JobOfferCard
                    key={offer.id}
                    offer={offer}
                    language={language}
                    onClose={handleCloseOffer}
                    onDelete={handleDeleteOffer}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteOfferDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open })}
        onConfirm={confirmDelete}
        candidateCount={deleteDialog.candidateCount}
        language={language}
      />
    </div>
  )
}
