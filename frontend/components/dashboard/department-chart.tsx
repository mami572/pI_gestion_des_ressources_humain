"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DepartmentDistributionProps {
  language: "fr" | "ar"
}

export default function DepartmentDistribution({ language }: DepartmentDistributionProps) {
  const translations = {
    fr: {
      title: "Distribution par Département",
    },
    ar: {
      title: "التوزيع حسب الإدارة",
    },
  }

  const t = translations[language]

  const departments = [
    { name: "Informatique", nameAr: "المعلوماتية", count: 15, color: "from-blue-500 to-blue-400" },
    { name: "RH", nameAr: "الموارد البشرية", count: 8, color: "from-emerald-500 to-emerald-400" },
    { name: "Finance", nameAr: "المالية", count: 10, color: "from-amber-500 to-amber-400" },
    { name: "Ventes", nameAr: "المبيعات", count: 12, color: "from-purple-500 to-purple-400" },
    { name: "Marketing", nameAr: "التسويق", count: 7, color: "from-pink-500 to-pink-400" },
  ]

  return (
    <Card className="glass-card border-none h-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {departments.map((dept, i) => (
            <div key={i} className="group cursor-default">
              <div className="flex justify-between items-end mb-1.5">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground/80">{language === "fr" ? dept.name : dept.nameAr}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black leading-none">{dept.count}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{language === "fr" ? "Pers" : "فرد"}</span>
                </div>
              </div>
              <div className="h-2.5 w-full bg-muted/30 rounded-full overflow-hidden p-[1px] backdrop-blur-sm">
                <div
                  className={`h-full bg-gradient-to-r ${dept.color} rounded-full transition-all duration-700 group-hover:scale-x-[1.02] origin-left`}
                  style={{ width: `${(dept.count / 15) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-muted-foreground">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Total</span>
            <span className="text-xl font-black text-foreground">52</span>
          </div>
          <div className="flex -space-x-3 overflow-hidden">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
