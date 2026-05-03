import { z } from "zod"

export const affiliatePlatforms = ["shopee", "tokopedia", "tiktok_shop"] as const

export const affiliateLinkSchema = z.object({
  title:        z.string().min(2, "Judul minimal 2 karakter"),
  platform:     z.enum(affiliatePlatforms, { errorMap: () => ({ message: "Pilih platform" }) }),
  url:          z.string().url("URL tidak valid"),
  thumbnailUrl: z.string().url("URL thumbnail tidak valid").optional().or(z.literal("")),
  description:  z.string().optional(),
  tags:         z.array(z.string()).default([]),
  isActive:     z.boolean().default(true),
})

export type AffiliateLinkInput = z.infer<typeof affiliateLinkSchema>