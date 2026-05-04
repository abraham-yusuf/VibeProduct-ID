"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, ExternalLink } from "lucide-react"

interface Affiliate {
  id: string; title: string; platform: string
  url: string; thumbnailUrl: string | null
}

interface Props {
  open:      boolean
  onClose:   () => void
  affiliates: Affiliate[]
  onSelect:  (a: Affiliate) => void
}

const platformConfig: Record<string, { label: string; color: string }> = {
  shopee:      { label: "Shopee",      color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  tokopedia:   { label: "Tokopedia",   color: "bg-green-500/15 text-green-400 border-green-500/20" },
  tiktok_shop: { label: "TikTok Shop", color: "bg-pink-500/15 text-pink-400 border-pink-500/20" },
}

export function AffiliatePicker({ open, onClose, affiliates, onSelect }: Props) {
  const [search, setSearch]     = useState("")
  const [platform, setPlatform] = useState("all")

  const filtered = affiliates.filter((a) => {
    const matchSearch   = a.title.toLowerCase().includes(search.toLowerCase())
    const matchPlatform = platform === "all" || a.platform === platform
    return matchSearch && matchPlatform
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>🛍️ Pilih Produk Affiliate</DialogTitle>
        </DialogHeader>

        {/* Filters */}
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5">
            {["all", "shopee", "tokopedia", "tiktok_shop"].map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
                  platform === p
                    ? "gradient-brand text-white border-transparent"
                    : "border-border/50 text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "all" ? "Semua" : platformConfig[p]?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="overflow-y-auto flex-1 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              Tidak ada produk yang cocok.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-2">
              {filtered.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => onSelect(a)}
                  className="group text-left rounded-xl border border-border/50 overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
                >
                  {a.thumbnailUrl ? (
                    <div className="aspect-square relative bg-muted overflow-hidden">
                      <Image
                        src={a.thumbnailUrl}
                        alt={a.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted flex items-center justify-center text-3xl">
                      🛍️
                    </div>
                  )}
                  <div className="p-2.5 space-y-1">
                    <Badge variant="outline" className={`text-xs ${platformConfig[a.platform]?.color}`}>
                      {platformConfig[a.platform]?.label}
                    </Badge>
                    <p className="text-xs font-medium line-clamp-2 leading-snug">{a.title}</p>
                    <p className="text-xs text-primary flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" /> Sisipkan
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}