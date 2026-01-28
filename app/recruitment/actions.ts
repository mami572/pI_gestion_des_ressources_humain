"use server"

import { query } from "@/backend/lib/db"
import { generateSummary } from "@/backend/lib/ai"
import { cookies } from "next/headers"
import { z } from "zod"

// Validation Schemas
const jobOfferSchema = z.object({
    title: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(191, "Titre trop long"),
    department: z.string().min(2, "Le département est requis").max(191, "Département trop long"),
    location: z.string().min(2, "Le lieu est requis").max(191, "Lieu trop long"),
    type: z.enum(["CDI", "CDD", "Stage", "Freelance"], {
        errorMap: () => ({ message: "Type de contrat invalide" }),
    }),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    status: z.enum(["open", "closed"], {
        errorMap: () => ({ message: "Statut invalide" }),
    }).optional(),
})

const candidateStatusSchema = z.enum(["new", "inReview", "shortlisted", "rejected", "hired"])

// Helper: Check user permissions
async function checkPermissions() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("user_id")?.value

    if (!userId) {
        throw new Error("Non authentifié")
    }

    const result: any = await query("SELECT role FROM User WHERE id = ?", [userId])

    if (result.length === 0) {
        throw new Error("Utilisateur non trouvé")
    }

    const role = result[0].role

    if (role !== "admin" && role !== "hr") {
        throw new Error("Permission refusée. Seuls les Admin et RH peuvent effectuer cette action.")
    }

    return { userId, role }
}

// Get all job offers with optional filters
export async function getJobOffers(filters?: {
    status?: string
    department?: string
    search?: string
}) {
    try {
        let sql = `
      SELECT 
        jo.*,
        COUNT(c.id) as candidate_count
      FROM JobOffer jo
      LEFT JOIN Candidate c ON jo.id = c.job_offer_id
      WHERE 1=1
    `
        const params: any[] = []

        if (filters?.status && filters.status !== "all") {
            sql += " AND jo.status = ?"
            params.push(filters.status)
        }

        if (filters?.department && filters.department !== "all") {
            sql += " AND jo.department = ?"
            params.push(filters.department)
        }

        if (filters?.search) {
            sql += " AND (jo.title LIKE ? OR jo.description LIKE ?)"
            const searchTerm = `%${filters.search}%`
            params.push(searchTerm, searchTerm)
        }

        sql += " GROUP BY jo.id ORDER BY jo.created_at DESC"

        const offers = await query(sql, params)
        return { success: true, data: offers }
    } catch (error: any) {
        console.error("[getJobOffers] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la récupération des offres" }
    }
}

// Get job offer by ID
export async function getJobOfferById(id: number) {
    try {
        const result: any = await query("SELECT * FROM JobOffer WHERE id = ?", [id])

        if (result.length === 0) {
            return { success: false, error: "Offre non trouvée" }
        }

        return { success: true, data: result[0] }
    } catch (error: any) {
        console.error("[getJobOfferById] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la récupération de l'offre" }
    }
}

// Create new job offer
export async function createJobOffer(data: z.infer<typeof jobOfferSchema>) {
    try {
        // Check permissions
        await checkPermissions()

        // Validate data
        const validated = jobOfferSchema.parse(data)

        // Insert into database
        const result: any = await query(
            `INSERT INTO JobOffer (title, department, location, type, description, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                validated.title,
                validated.department,
                validated.location,
                validated.type,
                validated.description,
                validated.status || "open",
            ]
        )

        console.log("[createJobOffer] Success: Created offer ID", result.insertId)

        return {
            success: true,
            data: { id: result.insertId },
            message: "Offre d'emploi créée avec succès",
        }
    } catch (error: any) {
        console.error("[createJobOffer] Error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: error.message || "Erreur lors de la création de l'offre" }
    }
}

// Update job offer
export async function updateJobOffer(id: number, data: Partial<z.infer<typeof jobOfferSchema>>) {
    try {
        // Check permissions
        await checkPermissions()

        // Validate data (partial)
        const validated = jobOfferSchema.partial().parse(data)

        // Build update query dynamically
        const fields = Object.keys(validated)
        if (fields.length === 0) {
            return { success: false, error: "Aucune donnée à mettre à jour" }
        }

        const setClause = fields.map((field) => `${field} = ?`).join(", ")
        const values = fields.map((field) => (validated as any)[field])

        await query(`UPDATE JobOffer SET ${setClause}, updated_at = NOW() WHERE id = ?`, [...values, id])

        console.log("[updateJobOffer] Success: Updated offer ID", id)

        return {
            success: true,
            message: "Offre d'emploi mise à jour avec succès",
        }
    } catch (error: any) {
        console.error("[updateJobOffer] Error:", error)

        if (error instanceof z.ZodError) {
            return { success: false, error: error.errors[0].message }
        }

        return { success: false, error: error.message || "Erreur lors de la mise à jour de l'offre" }
    }
}

// Close job offer
export async function closeJobOffer(id: number) {
    try {
        // Check permissions
        await checkPermissions()

        await query("UPDATE JobOffer SET status = ?, updated_at = NOW() WHERE id = ?", ["closed", id])

        console.log("[closeJobOffer] Success: Closed offer ID", id)

        return {
            success: true,
            message: "Offre fermée avec succès",
        }
    } catch (error: any) {
        console.error("[closeJobOffer] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la fermeture de l'offre" }
    }
}

// Delete job offer (with protection)
export async function deleteJobOffer(id: number, force: boolean = false) {
    try {
        // Check permissions
        await checkPermissions()

        // Check for candidates
        const candidates: any = await query("SELECT COUNT(*) as count FROM Candidate WHERE job_offer_id = ?", [id])

        const candidateCount = candidates[0].count

        if (candidateCount > 0 && !force) {
            return {
                success: false,
                error: "Cette offre contient des candidats",
                candidateCount,
                requiresConfirmation: true,
            }
        }

        // Delete candidates first if force is true
        if (candidateCount > 0 && force) {
            await query("DELETE FROM Candidate WHERE job_offer_id = ?", [id])
            console.log("[deleteJobOffer] Deleted", candidateCount, "candidates")
        }

        // Delete job offer
        await query("DELETE FROM JobOffer WHERE id = ?", [id])

        console.log("[deleteJobOffer] Success: Deleted offer ID", id)

        return {
            success: true,
            message: "Offre d'emploi supprimée avec succès",
        }
    } catch (error: any) {
        console.error("[deleteJobOffer] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la suppression de l'offre" }
    }
}

// Get candidates by job offer
export async function getCandidatesByOffer(offerId: number) {
    try {
        const candidates = await query(
            `SELECT * FROM Candidate WHERE job_offer_id = ? ORDER BY created_at DESC`,
            [offerId]
        )

        return { success: true, data: candidates }
    } catch (error: any) {
        console.error("[getCandidatesByOffer] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la récupération des candidats" }
    }
}

// Get all candidates
export async function getCandidates() {
    try {
        const candidates = await query(
            `SELECT 
        c.*,
        jo.title as job_title
      FROM Candidate c
      LEFT JOIN JobOffer jo ON c.job_offer_id = jo.id
      ORDER BY c.created_at DESC`
        )

        return { success: true, data: candidates }
    } catch (error: any) {
        console.error("[getCandidates] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la récupération des candidats" }
    }
}

// Get departments for filters
export async function getDepartments() {
    try {
        const result = await query("SELECT DISTINCT department FROM JobOffer ORDER BY department")
        return { success: true, data: result }
    } catch (error: any) {
        console.error("[getDepartments] Error:", error)
        return { success: false, error: "Erreur lors de la récupération des départements" }
    }
}

// AI: Summarize Candidate CV
export async function summarizeCandidateCV(candidateId: number) {
    try {
        // Check permissions
        await checkPermissions()

        // Get candidate details
        const result: any = await query("SELECT * FROM Candidate WHERE id = ?", [candidateId])
        if (result.length === 0) {
            return { success: false, error: "Candidat non trouvé" }
        }

        const candidate = result[0]

        // Prepare content for AI (prefer notes/cover letter if CV parsing not fully implemented)
        const contentToSummarize = `
            Nom: ${candidate.first_name} ${candidate.last_name}
            Email: ${candidate.email}
            Expérience: ${candidate.years_of_experience || 'Non spécifié'} ans
            Niveau d'études: ${candidate.education_level || 'Non spécifié'}
            Lettre de motivation: ${candidate.cover_letter || 'Non spécifiée'}
            Notes: ${candidate.notes || 'Aucune'}
        `

        const summary = await generateSummary(
            contentToSummarize,
            "Tu es un expert en recrutement. Résume le profil de ce candidat en mettant en évidence ses points forts et sa pertinence pour le poste."
        )

        return { success: true, data: summary }
    } catch (error: any) {
        console.error("[summarizeCandidateCV] Error:", error)
        return { success: false, error: error.message || "Erreur lors de la génération du résumé" }
    }
}
