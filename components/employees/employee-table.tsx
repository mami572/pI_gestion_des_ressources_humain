"use client"

import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmployeeTableProps {
  employees: any[]
  language: "fr" | "ar"
}

export default function EmployeeTable({ employees, language }: EmployeeTableProps) {
  const translations = {
    fr: {
      name: "Nom",
      code: "Code",
      position: "Poste",
      department: "Département",
      email: "Email",
      phone: "Téléphone",
      status: "Statut",
      actions: "Actions",
    },
    ar: {
      name: "الاسم",
      code: "الرمز",
      position: "المنصب",
      department: "الإدارة",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      status: "الحالة",
      actions: "الإجراءات",
    },
  }

  const t = translations[language]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">{t.name}</th>
            <th className="text-left p-3 font-semibold">{t.code}</th>
            <th className="text-left p-3 font-semibold">{t.position}</th>
            <th className="text-left p-3 font-semibold">{t.department}</th>
            <th className="text-left p-3 font-semibold">{t.email}</th>
            <th className="text-left p-3 font-semibold">{t.status}</th>
            <th className="text-center p-3 font-semibold">{t.actions}</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-border hover:bg-muted/50 transition">
              <td className="p-3 font-medium">
                {employee.first_name} {employee.last_name}
              </td>
              <td className="p-3 text-muted-foreground">{employee.employee_code}</td>
              <td className="p-3">{employee.position}</td>
              <td className="p-3">{employee.department_name || employee.department}</td>
              <td className="p-3 text-muted-foreground text-xs">{employee.email}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    employee.status === "active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {employee.status}
                </span>
              </td>
              <td className="p-3 text-center">
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
