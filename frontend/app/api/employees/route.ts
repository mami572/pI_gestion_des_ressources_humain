import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const employees: any = await query(`
      SELECT e.*, u.email, u.role, d.name as department_name
      FROM Employee e
      LEFT JOIN User u ON e.user_id = u.id
      LEFT JOIN Department d ON e.department = d.id
      ORDER BY e.first_name ASC
    `)

    return NextResponse.json(employees, { status: 200 })
  } catch (error) {
    console.error("Get employees error:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      first_name,
      last_name,
      employee_code,
      position,
      hire_date,
      salary,
      currency,
      phone,
      address,
      status,
      department,
      user_id,
    } = body

    const result: any = await query(
      `INSERT INTO Employee (
        user_id, first_name, last_name, employee_code, position,
        hire_date, salary, currency, phone, address, status, department, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        user_id,
        first_name,
        last_name,
        employee_code,
        position,
        hire_date,
        salary,
        currency,
        phone,
        address,
        status,
        department,
      ],
    )

    return NextResponse.json(
      { id: (result as any).insertId, message: "Employee created successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create employee error:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
