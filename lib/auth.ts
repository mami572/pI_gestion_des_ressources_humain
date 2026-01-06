import bcryptjs from "bcryptjs"
import { query } from "./db"

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export async function authenticateUser(email: string, password: string) {
  const result: any = await query("SELECT id, email, role FROM User WHERE email = ?", [email])

  if (result.length === 0) {
    return null
  }

  const user = result[0]
  const passwordHash: any = await query("SELECT password_hash FROM User WHERE id = ?", [user.id])

  if (passwordHash.length === 0) {
    return null
  }

  const isValid = await comparePassword(password, passwordHash[0].password_hash)
  return isValid ? user : null
}

