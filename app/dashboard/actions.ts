"use server"

import { query } from "@/backend/lib/db"
import { generateSummary } from "@/backend/lib/ai"
import { cookies } from "next/headers"

async function checkAuth() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value
    if (!userId) throw new Error("Non authentifié")
    return userId
}

export async function getAIWorkforceInsights() {
    try {
        await checkAuth()

        // 1. Get Workforce Stats
        const employeeStats: any = await query(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
                AVG(DATEDIFF(NOW(), hire_date)/365) as avg_tenure
            FROM Employee
        `)

        const deptStats: any = await query(`
            SELECT d.name, COUNT(e.id) as count
            FROM Department d
            LEFT JOIN Employee e ON d.id = e.department_id
            GROUP BY d.id
        `)

        const attendanceStats: any = await query(`
            SELECT 
                date,
                COUNT(*) as present_count
            FROM Attendance
            WHERE date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY date
            ORDER BY date DESC
        `)

        const recruitmentStats: any = await query(`
            SELECT status, COUNT(*) as count
            FROM Candidate
            GROUP BY status
        `)

        // 2. Prepare Data for AI
        const dataString = `
            Total Employés: ${employeeStats[0].total} (${employeeStats[0].active} actifs)
            Ancienneté Moyenne: ${Math.round(employeeStats[0].avg_tenure * 10) / 10} ans
            Répartition par Département: ${deptStats.map((d: any) => `${d.name}: ${d.count}`).join(", ")}
            Présences (7 derniers jours): ${attendanceStats.map((a: any) => `Le ${a.date.toLocaleDateString()}: ${a.present_count}`).join(", ")}
            État du Recrutement: ${recruitmentStats.map((r: any) => `${r.status}: ${r.count}`).join(", ")}
        `

        // 3. Generate Insights
        const insights = await generateSummary(
            dataString,
            "Tu es un consultant expert en RH. Analyse ces données d'entreprise et fournis une analyse stratégique concise (points forts, points faibles, recommandations) pour le directeur général. Réponds en français."
        )

        return { success: true, data: insights }
    } catch (error: any) {
        console.error("[getAIWorkforceInsights] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la génération des insights" }
    }
}
