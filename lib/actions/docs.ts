"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { docsPages, docsCategories } from "@/lib/db/schema/docs"
import {
  docsPageSchema, docsCategorySchema,
  type DocsPageInput, type DocsCategoryInput,
} from "@/lib/validations/ideathon"
import { eq } from "drizzle-orm"
import { slugify } from "@/lib/utils"

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error("Unauthorized")
}

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string }

// ── CATEGORIES ────────────────────────────────────────────────────────────────
export async function createDocsCategory(input: DocsCategoryInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = docsCategorySchema.parse(input)
    await db.insert(docsCategories).values(data)
    revalidatePath("/dashboard/docs")
    revalidatePath("/docs")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat kategori" }
  }
}

export async function updateDocsCategory(id: string, input: DocsCategoryInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = docsCategorySchema.parse(input)
    await db.update(docsCategories).set(data).where(eq(docsCategories.id, id))
    revalidatePath("/dashboard/docs")
    revalidatePath("/docs")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate kategori" }
  }
}

export async function deleteDocsCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(docsCategories).where(eq(docsCategories.id, id))
    revalidatePath("/dashboard/docs")
    revalidatePath("/docs")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus kategori" }
  }
}

// ── PAGES ─────────────────────────────────────────────────────────────────────
export async function createDocsPage(input: DocsPageInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const data = docsPageSchema.parse(input)
    const [page] = await db.insert(docsPages).values({
      ...data,
      slug: data.slug || slugify(data.title),
    }).returning({ id: docsPages.id })
    revalidatePath("/dashboard/docs")
    revalidatePath("/docs")
    return { success: true, data: { id: page.id } }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat halaman" }
  }
}

export async function updateDocsPage(id: string, input: DocsPageInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = docsPageSchema.parse(input)
    await db.update(docsPages).set({ ...data, updatedAt: new Date() }).where(eq(docsPages.id, id))
    revalidatePath("/dashboard/docs")
    revalidatePath("/docs")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate halaman" }
  }
}

export async function deleteDocsPage(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(docsPages).where(eq(docsPages.id, id))
    revalidatePath("/dashboard/docs")
    revalidatePath("/docs")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus halaman" }
  }
}