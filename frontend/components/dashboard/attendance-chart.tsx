"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    <Card className="glass-card border-none h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold tracking-tight">{t.title}</CardTitle>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-[10px] font-bold border-accent/20 text-accent bg-accent/5">SEMAINE</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {data.map((d, i) => (
            <div key={i} className="group relative">
              <div className="flex justify-between text-sm mb-1.5 px-0.5">
                <span className="font-bold text-foreground/80">{d.day}</span>
                <span className="text-primary font-mono font-bold">{d.present}%</span>
              </div>
              <div className="flex gap-1.5 h-3 bg-muted/30 rounded-full overflow-hidden p-[2px] backdrop-blur-sm">
                <div
                  className="bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000 group-hover:brightness-110"
                  style={{ width: `${(d.present / 100) * 100}%` }}
                />
                <div
                  className="bg-destructive/40 rounded-full transition-all duration-1000"
                  style={{ width: `${(d.absent / 100) * 100}%` }}
                />
                <div
                  className="bg-amber-400/40 rounded-full transition-all duration-1000"
                  style={{ width: `${(d.late / 100) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{t.presentLabel}</p>
            <p className="text-2xl font-black text-primary">87%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{t.absentLabel}</p>
            <p className="text-2xl font-black text-destructive/80">10%</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground mb-1">{t.lateLabel}</p>
            <p className="text-2xl font-black text-amber-500/80">6%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
