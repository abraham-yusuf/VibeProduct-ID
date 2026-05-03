"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { affiliateLinks } from "@/lib/db/schema/affiliate"
import { affiliateLinkSchema, type AffiliateLinkInput } from "@/lib/validations/affiliate"
import { eq, sql } from "drizzle-orm"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
}

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

export async function createAffiliateLink(input: AffiliateLinkInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = affiliateLinkSchema.parse(input)
    await db.insert(affiliateLinks).values({
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
    })
    revalidatePath("/dashboard/affiliate")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menambah link" }
  }
}

export async function updateAffiliateLink(id: string, input: AffiliateLinkInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = affiliateLinkSchema.parse(input)
    await db.update(affiliateLinks).set({
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
      updatedAt: new Date(),
    }).where(eq(affiliateLinks.id, id))
    revalidatePath("/dashboard/affiliate")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate link" }
  }
}

export async function deleteAffiliateLink(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(affiliateLinks).where(eq(affiliateLinks.id, id))
    revalidatePath("/dashboard/affiliate")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus link" }
  }
}

export async function toggleAffiliateLinkStatus(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.update(affiliateLinks).set({ isActive, updatedAt: new Date() }).where(eq(affiliateLinks.id, id))
    revalidatePath("/dashboard/affiliate")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengubah status" }
  }
}

// Public: increment click count
export async function incrementClickCount(id: string): Promise<void> {
  await db.update(affiliateLinks)
    .set({ clickCount: sql`${affiliateLinks.clickCount} + 1` })
    .where(eq(affiliateLinks.id, id))
}