"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { WeddingThemeCard } from "./wedding-theme-card"
import { WeddingPreviewModal } from "./wedding-preview-modal"
import { cn } from "@/lib/utils"

interface Theme {
  id: string
  name: string
  category: string
  price: number
  demoUrl: string
  thumbnailUrl: string | null
  description: string | null
  features: string[] | null
  whatsappMsg: string | null
}

const categoryLabels: Record<string, string> = {
  minimalis: "Minimalis",
  modern:    "Modern",
  islami:    "Islami",
  rustic:    "Rustic",
  royal:     "Royal",
  floral:    "Floral",
  vintage:   "Vintage",
}

export function WeddingGallery({ themes }: { themes: Theme[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [previewTheme, setPreviewTheme]     = useState<Theme | null>(null)

  // Build category list from available themes
  const categories = ["all", ...Array.from(new Set(themes.map((t) => t.category)))]

  const filtered =
    activeCategory === "all"
      ? themes
      : themes.filter((t) => t.category === activeCategory)

  if (themes.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Belum ada tema tersedia. Silakan cek kembali nanti.
      </div>
    )
  }

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium border transition-all",
              activeCategory === cat
                ? "gradient-brand text-white border-transparent"
                : "border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
            )}
          >
            {cat === "all" ? "Semua" : categoryLabels[cat] ?? cat}
            <span className="ml-1.5 text-xs opacity-70">
              ({cat === "all" ? themes.length : themes.filter((t) => t.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((theme, i) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <WeddingThemeCard
              theme={theme}
              onPreview={() => setPreviewTheme(theme)}
            />
          </motion.div>
        ))}
      </div>

      {previewTheme && (
        <WeddingPreviewModal
          theme={previewTheme}
          open={!!previewTheme}
          onClose={() => setPreviewTheme(null)}
        />
      )}
    </>
  )
}