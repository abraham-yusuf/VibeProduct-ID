"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { smmCategories, smmPackages, smmOrders } from "@/lib/db/schema/smm"
import { categorySchema, packageSchema, type CategoryInput, type PackageInput } from "@/lib/validations/smm"
import { eq } from "drizzle-orm"

// ── helpers ──────────────────────────────────────────────────────────────────
async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
  return session
}

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

// ── CATEGORIES ───────────────────────────────────────────────────────────────
export async function createCategory(input: CategoryInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = categorySchema.parse(input)
    await db.insert(smmCategories).values(data)
    revalidatePath("/dashboard/smm")
    revalidatePath("/smm")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat kategori" }
  }
}

export async function updateCategory(id: string, input: CategoryInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = categorySchema.parse(input)
    await db.update(smmCategories).set({ ...data }).where(eq(smmCategories.id, id))
    revalidatePath("/dashboard/smm")
    revalidatePath("/smm")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate kategori" }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(smmCategories).where(eq(smmCategories.id, id))
    revalidatePath("/dashboard/smm")
    revalidatePath("/smm")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus kategori" }
  }
}

// ── PACKAGES ─────────────────────────────────────────────────────────────────
export async function createPackage(input: PackageInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = packageSchema.parse(input)
    await db.insert(smmPackages).values(data)
    revalidatePath("/dashboard/smm/packages")
    revalidatePath("/smm")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat paket" }
  }
}

export async function updatePackage(id: string, input: PackageInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = packageSchema.parse(input)
    await db.update(smmPackages).set({ ...data, updatedAt: new Date() }).where(eq(smmPackages.id, id))
    revalidatePath("/dashboard/smm/packages")
    revalidatePath("/smm")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate paket" }
  }
}

export async function togglePackageStatus(id: string, isActive: boolean): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.update(smmPackages).set({ isActive, updatedAt: new Date() }).where(eq(smmPackages.id, id))
    revalidatePath("/dashboard/smm/packages")
    revalidatePath("/smm")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengubah status" }
  }
}

export async function deletePackage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(smmPackages).where(eq(smmPackages.id, id))
    revalidatePath("/dashboard/smm/packages")
    revalidatePath("/smm")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus paket" }
  }
}

// ── ORDERS ───────────────────────────────────────────────────────────────────
export async function updateOrderStatus(
  id: string,
  status: "processing" | "completed" | "failed" | "cancelled" | "refunded",
  adminNotes?: string
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.update(smmOrders).set({
      status,
      adminNotes: adminNotes ?? null,
      updatedAt: new Date(),
      ...(status === "completed" ? { completedAt: new Date() } : {}),
    }).where(eq(smmOrders.id, id))
    revalidatePath("/dashboard/smm/orders")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate status order" }
  }
}