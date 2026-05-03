// ─── lib/validations/docs.ts ─────────────────────────────────────────────────
import { z as zd } from "zod"

export const docsCategorySchema = zd.object({
  name:      zd.string().min(2, "Nama minimal 2 karakter"),
  slug:      zd.string().min(2).regex(/^[a-z0-9-]+$/),
  sortOrder: zd.coerce.number().default(0),
})

export const docsPageSchema = zd.object({
  categoryId:     zd.string().uuid("Pilih kategori"),
  title:          zd.string().min(3, "Judul minimal 3 karakter"),
  slug:           zd.string().min(3).regex(/^[a-z0-9-]+$/, "Hanya huruf kecil, angka, dan -"),
  content:        zd.string().default(""),
  adsenseEnabled: zd.boolean().default(false),
  sortOrder:      zd.coerce.number().default(0),
  isPublished:    zd.boolean().default(true),
})

export type DocsCategoryInput = zd.infer<typeof docsCategorySchema>
export type DocsPageInput     = zd.infer<typeof docsPageSchema>