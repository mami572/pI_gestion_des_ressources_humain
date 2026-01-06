"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AttendanceChartProps {
  language: "fr" | "ar"
}

export default function AttendanceChart({ language }: AttendanceChartProps) {
  const translations = {
    fr: {
      title: "Tendance de Présence",
      presentLabel: "Présents",
      absentLabel: "Absents",
      lateLabel: "Retards",
    },
    ar: {
      title: "اتجاه الحضور",
      presentLabel: "حاضرون",
      absentLabel: "غائبون",
      lateLabel: "متأخرون",
    },
  }

  const t = translations[language]

  const data = [
    { day: "Lun", present: 85, absent: 10, late: 5 },
    { day: "Mar", present: 88, absent: 8, late: 4 },
    { day: "Mer", present: 82, absent: 12, late: 6 },
    { day: "Jeu", present: 90, absent: 5, late: 5 },
    { day: "Ven", present: 75, absent: 15, late: 10 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((d, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{d.day}</span>
                <span className="text-muted-foreground">{d.present}%</span>
              </div>
              <div className="flex gap-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="bg-accent rounded-full" style={{ width: `${(d.present / 100) * 100}%` }} />
                <div className="bg-destructive rounded-full" style={{ width: `${(d.absent / 100) * 100}%` }} />
                <div className="bg-secondary rounded-full" style={{ width: `${(d.late / 100) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t">
          <div>
            <p className="text-xs text-muted-foreground">{t.presentLabel}</p>
            <p className="text-lg font-bold text-accent">87%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.absentLabel}</p>
            <p className="text-lg font-bold text-destructive">10%</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t.lateLabel}</p>
            <p className="text-lg font-bold text-secondary">6%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
