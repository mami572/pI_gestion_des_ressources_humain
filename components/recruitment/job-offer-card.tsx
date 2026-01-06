"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreVertical, XCircle, Trash2, Users, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

interface JobOfferCardProps {
    offer: {
        id: number
        title: string
        department: string
        location: string
        type: string
        status: string
        description: string
        candidate_count?: number
    }
    language: "fr" | "ar"
    onClose?: (id: number) => void
    onDelete?: (id: number) => void
}

export default function JobOfferCard({ offer, language, onClose, onDelete }: JobOfferCardProps) {
    const translations = {
        fr: {
            open: "Ouverte",
            closed: "Fermée",
            candidates: "candidats",
            edit: "Modifier",
            close: "Fermer",
            delete: "Supprimer",
            actions: "Actions",
        },
        ar: {
            open: "مفتوحة",
            closed: "مغلقة",
            candidates: "المرشحون",
            edit: "تعديل",
            close: "إغلاق",
            delete: "حذف",
            actions: "الإجراءات",
        },
    }

    const t = translations[language]

    return (
        <Link href={`/recruitment/${offer.id}`}>
            <Card className="hover:border-primary/50 transition-all cursor-pointer group">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-start gap-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                        {offer.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{offer.department}</p>
                                </div>
                                <Badge variant={offer.status === "open" ? "default" : "secondary"} className="shrink-0">
                                    {offer.status === "open" ? t.open : t.closed}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {offer.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" />
                                    {offer.type}
                                </span>
                                {offer.candidate_count !== undefined && (
                                    <span className="flex items-center gap-1 text-primary font-medium">
                                        <Users className="h-3 w-3" />
                                        {offer.candidate_count} {t.candidates}
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{offer.description}</p>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 ml-2">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">{t.actions}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/recruitment/${offer.id}/edit`} className="flex items-center">
                                        <Edit className="h-4 w-4 mr-2" />
                                        {t.edit}
                                    </Link>
                                </DropdownMenuItem>
                                {offer.status === "open" && onClose && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                onClose(offer.id)
                                            }}
                                            className="text-orange-600"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            {t.close}
                                        </DropdownMenuItem>
                                    </>
                                )}
                                {onDelete && (
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.preventDefault()
                                                onDelete(offer.id)
                                            }}
                                            className="text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            {t.delete}
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}
