"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { weddingThemes } from "@/lib/db/schema/wedding"
import { weddingThemeSchema, type WeddingThemeInput } from "@/lib/validations/wedding"
import { eq } from "drizzle-orm"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
  return session
}

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

export async function createTheme(input: WeddingThemeInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = weddingThemeSchema.parse(input)
    await db.insert(weddingThemes).values({
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
    })
    revalidatePath("/dashboard/wedding")
    revalidatePath("/wedding")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat tema" }
  }
}

export async function updateTheme(id: string, input: WeddingThemeInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = weddingThemeSchema.parse(input)
    await db.update(weddingThemes).set({
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
      updatedAt: new Date(),
    }).where(eq(weddingThemes.id, id))
    revalidatePath("/dashboard/wedding")
    revalidatePath("/wedding")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate tema" }
  }
}

export async function toggleThemeStatus(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.update(weddingThemes)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(weddingThemes.id, id))
    revalidatePath("/dashboard/wedding")
    revalidatePath("/wedding")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengubah status" }
  }
}

export async function deleteTheme(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(weddingThemes).where(eq(weddingThemes.id, id))
    revalidatePath("/dashboard/wedding")
    revalidatePath("/wedding")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus tema" }
  }
}

export async function updateSortOrder(
  items: { id: string; sortOrder: number }[]
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await Promise.all(
      items.map((item) =>
        db.update(weddingThemes)
          .set({ sortOrder: item.sortOrder, updatedAt: new Date() })
          .where(eq(weddingThemes.id, item.id))
      )
    )
    revalidatePath("/dashboard/wedding")
    revalidatePath("/wedding")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate urutan" }
  }
}