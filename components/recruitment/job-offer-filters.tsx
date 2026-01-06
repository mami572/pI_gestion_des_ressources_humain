"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface JobOfferFiltersProps {
    language: "fr" | "ar"
    filters: {
        status: string
        department: string
        search: string
    }
    departments: string[]
    onFiltersChange: (filters: any) => void
}

export default function JobOfferFilters({
    language,
    filters,
    departments,
    onFiltersChange,
}: JobOfferFiltersProps) {
    const translations = {
        fr: {
            search: "Rechercher une offre...",
            status: "Statut",
            department: "Département",
            all: "Tous",
            open: "Ouvertes",
            closed: "Fermées",
            clear: "Effacer",
        },
        ar: {
            search: "البحث عن عرض...",
            status: "الحالة",
            department: "الإدارة",
            all: "الكل",
            open: "المفتوحة",
            closed: "المغلقة",
            clear: "مسح",
        },
    }

    const t = translations[language]

    const hasActiveFilters = filters.status !== "all" || filters.department !== "all" || filters.search !== ""

    const clearFilters = () => {
        onFiltersChange({
            status: "all",
            department: "all",
            search: "",
        })
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t.search}
                            value={filters.search}
                            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                            className="pl-9"
                        />
                    </div>

                    {/* Status Filter */}
                    <Select
                        value={filters.status}
                        onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder={t.status} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t.all}</SelectItem>
                            <SelectItem value="open">{t.open}</SelectItem>
                            <SelectItem value="closed">{t.closed}</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Department Filter */}
                    <Select
                        value={filters.department}
                        onValueChange={(value) => onFiltersChange({ ...filters, department: value })}
                    >
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder={t.department} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t.all}</SelectItem>
                            {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                    {dept}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clear Filters */}
                    {hasActiveFilters && (
                        <Button variant="outline" size="icon" onClick={clearFilters} title={t.clear}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
