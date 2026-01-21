"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteOfferDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (force: boolean) => void
    candidateCount?: number
    language: "fr" | "ar"
}

export default function DeleteOfferDialog({
    open,
    onOpenChange,
    onConfirm,
    candidateCount = 0,
    language,
}: DeleteOfferDialogProps) {
    const translations = {
        fr: {
            title: candidateCount > 0 ? "Attention : Offre avec candidats" : "Supprimer l'offre",
            description:
                candidateCount > 0
                    ? `Cette offre contient ${candidateCount} candidat(s). En supprimant cette offre, tous les candidats associés seront également supprimés. Cette action est irréversible.`
                    : "Êtes-vous sûr de vouloir supprimer cette offre d'emploi ? Cette action est irréversible.",
            cancel: "Annuler",
            confirm: candidateCount > 0 ? "Supprimer tout" : "Supprimer",
        },
        ar: {
            title: candidateCount > 0 ? "تحذير: عرض مع المرشحين" : "حذف العرض",
            description:
                candidateCount > 0
                    ? `يحتوي هذا العرض على ${candidateCount} مرشح(ين). بحذف هذا العرض، سيتم حذف جميع المرشحين المرتبطين أيضًا. هذا الإجراء لا رجعة فيه.`
                    : "هل أنت متأكد من أنك تريد حذف عرض العمل هذا؟ هذا الإجراء لا رجعة فيه.",
            cancel: "إلغاء",
            confirm: candidateCount > 0 ? "حذف الكل" : "حذف",
        },
    }

    const t = translations[language]

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t.title}</AlertDialogTitle>
                    <AlertDialogDescription>{t.description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onConfirm(candidateCount > 0)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {t.confirm}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
