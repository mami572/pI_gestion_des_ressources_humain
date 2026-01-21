import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

export async function GET(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value

  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  try {
    const user: any = await query("SELECT id, email, role FROM User WHERE id = ?", [userId])

    if (user.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user[0], { status: 200 })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
