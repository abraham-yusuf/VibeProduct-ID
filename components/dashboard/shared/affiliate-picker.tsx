"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface Affiliate {
  id: string
  title: string
  platform: string
  url: string
  thumbnailUrl: string | null
}

interface Props {
  open: boolean
  onClose: () => void
  affiliates: Affiliate[]
  onSelect: (affiliate: Affiliate) => void
}

const platformLabel: Record<string, string> = {
  shopee: "Shopee",
  tokopedia: "Tokopedia",
  tiktok_shop: "TikTok Shop",
}

export function AffiliatePicker({ open, onClose, affiliates, onSelect }: Props) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return affiliates
    return affiliates.filter((a) => a.title.toLowerCase().includes(q))
  }, [affiliates, query])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pilih Affiliate Link</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari produk..."
            className="pl-9"
          />
        </div>

        <div className="space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-10 text-center">Tidak ada hasil.</p>
          ) : (
            filtered.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => onSelect(a)}
                className="w-full text-left rounded-xl border border-border/50 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 p-3">
                  {a.thumbnailUrl ? (
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={a.thumbnailUrl}
                        alt={a.title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 text-lg">
                      🛍️
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{a.title}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {platformLabel[a.platform] ?? a.platform}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{a.url}</p>
                  </div>

                  <Button type="button" size="sm" variant="secondary" className="shrink-0">
                    Pilih
                  </Button>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

