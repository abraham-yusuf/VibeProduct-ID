import { z } from "zod"

export const blogPostSchema = z.object({
  title:          z.string().min(3, "Judul minimal 3 karakter"),
  slug:           z.string().min(3, "Slug minimal 3 karakter").regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan tanda -"),
  content:        z.string().default(""),
  excerpt:        z.string().optional(),
  thumbnailUrl:   z.string().url("URL tidak valid").optional().or(z.literal("")),
  categoryId:     z.string().uuid().optional().or(z.literal("")),
  tags:           z.array(z.string()).default([]),
  status:         z.enum(["draft", "published", "scheduled"]).default("draft"),
  metaTitle:      z.string().optional(),
  metaDesc:       z.string().optional(),
  ogImage:        z.string().optional(),
  adsenseEnabled: z.boolean().default(false),
  publishedAt:    z.string().optional(),
})

export const blogCategorySchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().min(2, "Slug minimal 2 karakter").regex(/^[a-z0-9-]+$/),
})

export const aiSettingSchema = z.object({
  provider: z.enum(["openai", "anthropic", "openrouter"]),
  apiKey:   z.string().min(10, "API key tidak valid"),
  model:    z.string().min(2, "Model tidak valid"),
  isActive: z.boolean().default(false),
})

export const aiGenerateSchema = z.object({
  topic:    z.string().min(3, "Topik minimal 3 karakter"),
  length:   z.enum(["short", "medium", "long"]).default("medium"),
  tone:     z.enum(["formal", "casual", "persuasive", "informative"]).default("informative"),
  language: z.enum(["id", "en"]).default("id"),
  keywords: z.string().optional(),
})

export type BlogPostInput    = z.infer<typeof blogPostSchema>
export type BlogCategoryInput = z.infer<typeof blogCategorySchema>
export type AiSettingInput   = z.infer<typeof aiSettingSchema>
export type AiGenerateInput  = z.infer<typeof aiGenerateSchema>