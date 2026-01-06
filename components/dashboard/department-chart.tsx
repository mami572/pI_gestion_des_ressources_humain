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
    { name: "Informatique", count: 15, color: "bg-chart-1" },
    { name: "RH", count: 8, color: "bg-chart-2" },
    { name: "Finance", count: 10, color: "bg-chart-3" },
    { name: "Ventes", count: 12, color: "bg-chart-4" },
    { name: "Marketing", count: 7, color: "bg-chart-5" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {departments.map((dept, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{dept.name}</span>
                <span className="text-muted-foreground">{dept.count}</span>
              </div>
              <div className={`h-2 ${dept.color} rounded-full`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
