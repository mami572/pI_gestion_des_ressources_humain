"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Plus } from "lucide-react"

export default function PayrollPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")
  const [selectedPeriod, setSelectedPeriod] = useState("2025-12")

  const translations = {
    fr: {
      payroll: "Gestion de la Paie",
      period: "Période",
      generatePayroll: "Générer les Bulletins",
      employee: "Employé",
      basicSalary: "Salaire de Base",
      allowances: "Allocations",
      deductions: "Déductions",
      netSalary: "Salaire Net",
      status: "Statut",
      pending: "En Attente",
      paid: "Payé",
      socialSecurity: "Sécurité Sociale",
      tax: "Impôt",
      payrollRecords: "Bulletins de Paie",
    },
    ar: {
      payroll: "إدارة الرواتب",
      period: "الفترة",
      generatePayroll: "إنشاء كشوف الرواتب",
      employee: "الموظف",
      basicSalary: "الراتب الأساسي",
      allowances: "البدلات",
      deductions: "الخصومات",
      netSalary: "الراتب الصافي",
      status: "الحالة",
      pending: "معلق",
      paid: "مدفوع",
      socialSecurity: "الضمان الاجتماعي",
      tax: "الضريبة",
      payrollRecords: "كشوف الرواتب",
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

  const payrollData = [
    {
      id: 1,
      employee: "Ahmed Baye",
      basic: 50000,
      allowances: 2000,
      socialSecurity: 4160,
      tax: 7800,
      net: 40040,
      status: "pending",
    },
    {
      id: 2,
      employee: "Fatima Keita",
      basic: 45000,
      allowances: 1500,
      socialSecurity: 3720,
      tax: 7020,
      net: 35760,
      status: "paid",
    },
    {
      id: 3,
      employee: "Oumar Diallo",
      basic: 55000,
      allowances: 2500,
      socialSecurity: 4560,
      tax: 8580,
      net: 44360,
      status: "pending",
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">{t.payroll}</h1>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t.generatePayroll}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{t.period}</CardTitle>
              </CardHeader>
              <CardContent>
                <Input type="month" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.payrollRecords}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/50">
                      <tr>
                        <th className="text-left p-3 font-semibold">{t.employee}</th>
                        <th className="text-right p-3 font-semibold">{t.basicSalary}</th>
                        <th className="text-right p-3 font-semibold">{t.allowances}</th>
                        <th className="text-right p-3 font-semibold">{t.socialSecurity}</th>
                        <th className="text-right p-3 font-semibold">{t.tax}</th>
                        <th className="text-right p-3 font-semibold">{t.netSalary}</th>
                        <th className="text-left p-3 font-semibold">{t.status}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payrollData.map((record) => (
                        <tr key={record.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3 font-medium">{record.employee}</td>
                          <td className="text-right p-3">
                            {record.basic.toLocaleString()} {language === "fr" ? "MRU" : "MRU"}
                          </td>
                          <td className="text-right p-3">
                            {record.allowances.toLocaleString()} {language === "fr" ? "MRU" : "MRU"}
                          </td>
                          <td className="text-right p-3">
                            {record.socialSecurity.toLocaleString()} {language === "fr" ? "MRU" : "MRU"}
                          </td>
                          <td className="text-right p-3">
                            {record.tax.toLocaleString()} {language === "fr" ? "MRU" : "MRU"}
                          </td>
                          <td className="text-right p-3 font-semibold">
                            {record.net.toLocaleString()} {language === "fr" ? "MRU" : "MRU"}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                record.status === "paid"
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {record.status === "paid" ? t.paid : t.pending}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4 p-4 bg-muted rounded">
                  <div>
                    <p className="text-xs text-muted-foreground">{t.basicSalary}</p>
                    <p className="text-lg font-bold">150,000 MRU</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.socialSecurity}</p>
                    <p className="text-lg font-bold">12,440 MRU</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.tax}</p>
                    <p className="text-lg font-bold">23,400 MRU</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.netSalary}</p>
                    <p className="text-lg font-bold text-accent">120,160 MRU</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
