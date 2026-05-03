// ─── lib/validations/ideathon.ts ─────────────────────────────────────────────
import { z } from "zod"

export const embedTypes = ["youtube", "tiktok", "facebook", "instagram", "none"] as const

export const ideathonPostSchema = z.object({
  title:          z.string().min(3, "Judul minimal 3 karakter"),
  slug:           z.string().min(3).regex(/^[a-z0-9-]+$/, "Hanya huruf kecil, angka, dan -"),
  content:        z.string().default(""),
  thumbnailUrl:   z.string().url().optional().or(z.literal("")),
  categoryId:     z.string().uuid().optional().or(z.literal("")),
  tags:           z.array(z.string()).default([]),
  embedUrl:       z.string().url().optional().or(z.literal("")),
  embedType:      z.enum(embedTypes).default("none"),
  adsenseEnabled: z.boolean().default(false),
  isPublished:    z.boolean().default(false),
})

export const ideathonCategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
})

export type IdeathonPostInput     = z.infer<typeof ideathonPostSchema>
export type IdeathonCategoryInput = z.infer<typeof ideathonCategorySchema>

