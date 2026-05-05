/**
 * Script untuk membuat akun admin pertama
 * Jalankan: pnpm auth:create-admin
 */
import { createId } from "@paralleldrive/cuid2"
import * as bcrypt from "bcryptjs"
import { config as loadEnv } from "dotenv"

loadEnv({ path: ".env.local" })
if (!process.env.DATABASE_URL) {
  loadEnv({ path: ".env" })
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL belum diset. Silakan tambahkan ke .env.local atau .env terlebih dahulu.")
  process.exit(1)
}

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    ?? "admin@vibeproduct.biz.id"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "VibeAdmin2025!"
const ADMIN_NAME     = "Admin Vibe Product ID"

async function main() {
  const { db } = await import("../lib/db")
  const { users, accounts } = await import("../lib/db/schema/auth")

  console.log("🔧 Membuat akun admin...")

  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, ADMIN_EMAIL),
  })

  if (existing) {
    console.log("⚠️  Admin sudah ada:", ADMIN_EMAIL)
    process.exit(0)
  }

  const userId       = createId()
  const hashedPass   = await bcrypt.hash(ADMIN_PASSWORD, 12)
  const accountId    = createId()

  await db.insert(users).values({
    id: userId,
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    emailVerified: true,
  })

  await db.insert(accounts).values({
    id: accountId,
    accountId: userId,
    providerId: "credential",
    userId,
    password: hashedPass,
  })

  console.log("✅ Admin berhasil dibuat!")
  console.log("   Email   :", ADMIN_EMAIL)
  console.log("   Password:", ADMIN_PASSWORD)
  console.log("   ⚠️  Segera ganti password setelah login pertama!")
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })
