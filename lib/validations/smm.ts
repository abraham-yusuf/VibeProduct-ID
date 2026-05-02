import { z } from "zod"

export const platforms = [
  "instagram", "tiktok", "youtube", "twitter", "facebook", "telegram", "spotify",
] as const

export const categorySchema = z.object({
  name:      z.string().min(2, "Nama minimal 2 karakter"),
  platform:  z.enum(platforms, { errorMap: () => ({ message: "Pilih platform" }) }),
  icon:      z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive:  z.boolean().default(true),
})

export const packageSchema = z.object({
  categoryId:  z.string().uuid("Pilih kategori"),
  name:        z.string().min(3, "Nama minimal 3 karakter"),
  description: z.string().optional(),
  price:       z.coerce.number().min(100, "Harga minimal Rp 100"),
  minQty:      z.coerce.number().min(1).default(100),
  maxQty:      z.coerce.number().min(1).default(100000),
  sortOrder:   z.coerce.number().default(0),
  isActive:    z.boolean().default(true),
})

export const orderSchema = z.object({
  packageId:  z.string().uuid("Paket tidak valid"),
  buyerName:  z.string().min(2, "Nama minimal 2 karakter"),
  buyerEmail: z.string().email("Format email tidak valid"),
  buyerPhone: z.string().min(9, "No. HP minimal 9 digit").max(15),
  targetUrl:  z.string().min(3, "Username / URL wajib diisi"),
  quantity:   z.coerce.number().min(1, "Jumlah minimal 1"),
  notes:      z.string().optional(),
})

export type CategoryInput = z.infer<typeof categorySchema>
export type PackageInput  = z.infer<typeof packageSchema>
export type OrderInput    = z.infer<typeof orderSchema>