"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pin } from "lucide-react"

interface RecentAnnouncementsProps {
  language: "fr" | "ar"
}

export default function RecentAnnouncements({ language }: RecentAnnouncementsProps) {
  const [announcements, setAnnouncements] = useState<any[]>([])

  const translations = {
    fr: {
      title: "Annonces Récentes",
    },
    ar: {
      title: "الإعلانات الأخيرة",
    },
  }

  const t = translations[language]

  useEffect(() => {
    // Mock data for now
    setAnnouncements([
      {
        id: 1,
        title: "Bienvenue à tous",
        content: "Nous sommes ravis d'accueillir les nouveaux membres.",
        is_pinned: true,
        created_at: new Date(),
      },
      {
        id: 2,
        title: "Rappel Sécurité",
        content: "Veuillez badger à chaque entrée et sortie.",
        is_pinned: false,
        created_at: new Date(),
      },
    ])
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-sm">{announcement.title}</h3>
                {announcement.is_pinned && <Pin className="h-4 w-4 text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{announcement.content}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
