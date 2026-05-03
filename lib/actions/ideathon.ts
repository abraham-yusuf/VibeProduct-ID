"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { ideathonPosts, ideathonCategories } from "@/lib/db/schema/ideathon"
import {
  ideathonPostSchema, ideathonCategorySchema,
  type IdeathonPostInput, type IdeathonCategoryInput,
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

// ── POSTS ─────────────────────────────────────────────────────────────────────
export async function createIdeathonPost(input: IdeathonPostInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const data = ideathonPostSchema.parse(input)
    const [post] = await db.insert(ideathonPosts).values({
      ...data,
      slug:         data.slug || slugify(data.title),
      thumbnailUrl: data.thumbnailUrl || null,
      categoryId:   data.categoryId   || null,
      embedUrl:     data.embedUrl     || null,
      publishedAt:  data.isPublished ? new Date() : null,
    }).returning({ id: ideathonPosts.id })
    revalidatePath("/dashboard/ideathon")
    revalidatePath("/ideathon")
    return { success: true, data: { id: post.id } }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat post" }
  }
}

export async function updateIdeathonPost(id: string, input: IdeathonPostInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data    = ideathonPostSchema.parse(input)
    const existing = await db.query.ideathonPosts.findFirst({ where: eq(ideathonPosts.id, id) })
    await db.update(ideathonPosts).set({
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
      categoryId:   data.categoryId   || null,
      embedUrl:     data.embedUrl     || null,
      updatedAt:    new Date(),
      publishedAt:
        data.isPublished && !existing?.publishedAt ? new Date() : existing?.publishedAt,
    }).where(eq(ideathonPosts.id, id))
    revalidatePath("/dashboard/ideathon")
    revalidatePath("/ideathon")
    revalidatePath(`/ideathon/${data.slug}`)
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate post" }
  }
}

export async function deleteIdeathonPost(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(ideathonPosts).where(eq(ideathonPosts.id, id))
    revalidatePath("/dashboard/ideathon")
    revalidatePath("/ideathon")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus post" }
  }
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
export async function createIdeathonCategory(input: IdeathonCategoryInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = ideathonCategorySchema.parse(input)
    await db.insert(ideathonCategories).values(data)
    revalidatePath("/dashboard/ideathon")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat kategori" }
  }
}

export async function deleteIdeathonCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(ideathonCategories).where(eq(ideathonCategories.id, id))
    revalidatePath("/dashboard/ideathon")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus kategori" }
  }
}