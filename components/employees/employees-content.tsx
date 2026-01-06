"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import { Plus, Search } from "lucide-react"
import EmployeeTable from "@/components/employees/employee-table"
import EmployeeDialog from "@/components/employees/employee-dialog"

export default function EmployeesContent() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [employees, setEmployees] = useState<any[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<"fr" | "ar">("fr")
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  const translations = {
    fr: {
      employees: "Gestion des Employés",
      search: "Rechercher un employé...",
      addEmployee: "Ajouter un Employé",
      noResults: "Aucun employé trouvé",
    },
    ar: {
      employees: "إدارة الموظفين",
      search: "البحث عن موظف...",
      addEmployee: "إضافة موظف",
      noResults: "لم يتم العثور على موظفين",
    },
  }

  const t = translations[language]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }
        const userData = await response.json()
        setUser(userData)
      } catch (error) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees")
        const data = await response.json()
        setEmployees(data)
        setFilteredEmployees(data)
      } catch (error) {
        console.error("Failed to fetch employees:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchEmployees()
    }
  }, [user])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    const filtered = employees.filter((emp) =>
      `${emp.first_name} ${emp.last_name} ${emp.employee_code} ${emp.email}`
        .toLowerCase()
        .includes(value.toLowerCase()),
    )
    setFilteredEmployees(filtered)
  }

  const handleAddEmployee = () => {
    setSelectedEmployee(null)
    setDialogOpen(true)
  }

  const handleSaveEmployee = async (employeeData: any) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      })

      if (response.ok) {
        const response2 = await fetch("/api/employees")
        const data = await response2.json()
        setEmployees(data)
        setFilteredEmployees(data)
        setDialogOpen(false)
      }
    } catch (error) {
      console.error("Failed to save employee:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <DashboardSidebar language={language} user={user} />
        <div className="flex-1 flex flex-col">
          <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
          <div className="flex items-center justify-center flex-1">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader language={language} setLanguage={setLanguage} user={user} />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-primary">{t.employees}</h1>
              <Button onClick={handleAddEmployee} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                {t.addEmployee}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredEmployees.length > 0 ? (
                  <EmployeeTable employees={filteredEmployees} language={language} />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">{t.noResults}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
        language={language}
      />
    </div>
  )
}
