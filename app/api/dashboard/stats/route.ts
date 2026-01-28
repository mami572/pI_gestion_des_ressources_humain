import { NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET() {
  try {
    const totalEmployees: any = await query("SELECT COUNT(*) as count FROM Employee")

    const presentToday: any = await query(`
      SELECT COUNT(*) as count FROM Attendance
      WHERE DATE(date) = CURDATE() AND status = 'present'
    `)

    const pendingLeaves: any = await query(`
      SELECT COUNT(*) as count FROM LeaveRequest
      WHERE status = 'pending'
    `)

    const completedTrainings: any = await query(`
      SELECT COUNT(*) as count FROM Training
      WHERE status = 'completed'
    `)

    return NextResponse.json(
      {
        totalEmployees: totalEmployees[0].count,
        presentToday: presentToday[0].count,
        pendingLeaves: pendingLeaves[0].count,
        completedTrainings: completedTrainings[0].count,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}
