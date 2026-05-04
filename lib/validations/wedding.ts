import { z } from "zod"

export const weddingCategories = [
  "minimalis", "modern", "islami", "rustic", "royal", "floral", "vintage",
] as const

export const weddingThemeSchema = z.object({
  name:         z.string().min(2, "Nama tema minimal 2 karakter"),
  category:     z.enum(weddingCategories, { message: "Pilih kategori" }),
  price:        z.coerce.number().min(10000, "Harga minimal Rp 10.000"),
  demoUrl:      z.string().url("URL demo tidak valid"),
  thumbnailUrl: z.string().url("URL thumbnail tidak valid").optional().or(z.literal("")),
  description:  z.string().optional(),
  features:     z.array(z.string()).optional().default([]),
  whatsappMsg:  z.string().optional(),
  sortOrder:    z.coerce.number().default(0),
  isActive:     z.boolean().default(true),
})

export type WeddingThemeInput = z.infer<typeof weddingThemeSchema>