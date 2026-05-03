"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { blogPosts, blogCategories, aiSettings } from "@/lib/db/schema/blog"
import {
  blogPostSchema, blogCategorySchema, aiSettingSchema,
  type BlogPostInput, type BlogCategoryInput, type AiSettingInput,
} from "@/lib/validations/blog"
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
export async function createPost(input: BlogPostInput): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const data = blogPostSchema.parse(input)
    const [post] = await db.insert(blogPosts).values({
      ...data,
      slug:         data.slug || slugify(data.title),
      thumbnailUrl: data.thumbnailUrl || null,
      categoryId:   data.categoryId || null,
      publishedAt:  data.status === "published" ? new Date() : null,
    }).returning({ id: blogPosts.id })
    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    return { success: true, data: { id: post.id } }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat post" }
  }
}

export async function updatePost(id: string, input: BlogPostInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = blogPostSchema.parse(input)
    const existing = await db.query.blogPosts.findFirst({ where: eq(blogPosts.id, id) })
    await db.update(blogPosts).set({
      ...data,
      thumbnailUrl: data.thumbnailUrl || null,
      categoryId:   data.categoryId || null,
      updatedAt:    new Date(),
      publishedAt:
        data.status === "published" && !existing?.publishedAt
          ? new Date()
          : existing?.publishedAt,
    }).where(eq(blogPosts.id, id))
    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    revalidatePath(`/blog/${data.slug}`)
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal mengupdate post" }
  }
}

export async function deletePost(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(blogPosts).where(eq(blogPosts.id, id))
    revalidatePath("/dashboard/blog")
    revalidatePath("/blog")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus post" }
  }
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────
export async function createCategory(input: BlogCategoryInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = blogCategorySchema.parse(input)
    await db.insert(blogCategories).values(data)
    revalidatePath("/dashboard/blog")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal membuat kategori" }
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await db.delete(blogCategories).where(eq(blogCategories.id, id))
    revalidatePath("/dashboard/blog")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menghapus kategori" }
  }
}

// ── AI SETTINGS ───────────────────────────────────────────────────────────────
export async function upsertAiSetting(input: AiSettingInput): Promise<ActionResult> {
  try {
    await requireAdmin()
    const data = aiSettingSchema.parse(input)
    // Jika set aktif, nonaktifkan yang lain dulu
    if (data.isActive) {
      await db.update(aiSettings).set({ isActive: false })
    }
    const existing = await db.query.aiSettings.findFirst({
      where: eq(aiSettings.provider, data.provider),
    })
    if (existing) {
      await db.update(aiSettings).set({ ...data, updatedAt: new Date() })
        .where(eq(aiSettings.provider, data.provider))
    } else {
      await db.insert(aiSettings).values(data)
    }
    revalidatePath("/dashboard/settings/ai")
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e.message ?? "Gagal menyimpan pengaturan AI" }
  }
}