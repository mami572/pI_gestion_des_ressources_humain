"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EmployeeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: any
  onSave: (data: any) => void
  language: "fr" | "ar"
}

export default function EmployeeDialog({ open, onOpenChange, employee, onSave, language }: EmployeeDialogProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    employee_code: "",
    position: "",
    hire_date: "",
    salary: "",
    currency: "MRU",
    phone: "",
    address: "",
    status: "active",
    department: "",
    user_id: 0,
  })

  const translations = {
    fr: {
      addEmployee: "Ajouter un Employé",
      editEmployee: "Modifier l'Employé",
      firstName: "Prénom",
      lastName: "Nom",
      code: "Code Employé",
      position: "Poste",
      hireDate: "Date d'Embauche",
      salary: "Salaire",
      phone: "Téléphone",
      address: "Adresse",
      status: "Statut",
      department: "Département",
      save: "Enregistrer",
      cancel: "Annuler",
    },
    ar: {
      addEmployee: "إضافة موظف",
      editEmployee: "تعديل الموظف",
      firstName: "الاسم الأول",
      lastName: "الاسم الأخير",
      code: "رمز الموظف",
      position: "المنصب",
      hireDate: "تاريخ التوظيف",
      salary: "الراتب",
      phone: "الهاتف",
      address: "العنوان",
      status: "الحالة",
      department: "الإدارة",
      save: "حفظ",
      cancel: "إلغاء",
    },
  }

  const t = translations[language]

  useEffect(() => {
    if (employee) {
      setFormData(employee)
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        employee_code: "",
        position: "",
        hire_date: "",
        salary: "",
        currency: "MRU",
        phone: "",
        address: "",
        status: "active",
        department: "",
        user_id: 0,
      })
    }
  }, [employee, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{employee ? t.editEmployee : t.addEmployee}</DialogTitle>
          <DialogDescription>
            {employee ? "Modifier les informations de l'employé" : "Ajouter un nouvel employé au système"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">{t.firstName}</Label>
              <Input
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">{t.lastName}</Label>
              <Input
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_code">{t.code}</Label>
            <Input
              id="employee_code"
              name="employee_code"
              value={formData.employee_code}
              onChange={handleChange}
              placeholder="EMP001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">{t.position}</Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Senior Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hire_date">{t.hireDate}</Label>
            <Input id="hire_date" name="hire_date" type="date" value={formData.hire_date} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">{t.salary}</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              placeholder="50000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t.phone}</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+222 XXXX XXXX"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t.cancel}
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
