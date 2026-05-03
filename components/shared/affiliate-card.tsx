// ─── components/shared/affiliate-card.tsx ────────────────────────────────────
"use client"

import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { incrementClickCount } from "@/lib/actions/affiliate"

interface AffiliateLink {
  id: string; title: string; platform: string
  url: string; thumbnailUrl: string | null; description: string | null
}

const platformConfig: Record<string, { label: string; color: string }> = {
  shopee:      { label: "Shopee",      color: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  tokopedia:   { label: "Tokopedia",   color: "bg-green-500/15 text-green-400 border-green-500/20" },
  tiktok_shop: { label: "TikTok Shop", color: "bg-pink-500/15 text-pink-400 border-pink-500/20" },
}

export function AffiliateCard({ link }: { link: AffiliateLink }) {
  async function handleClick() {
    await incrementClickCount(link.id)
    window.open(link.url, "_blank", "noopener,noreferrer")
  }

  const pc = platformConfig[link.platform]

  return (
    <Card className="group border-border/50 hover:border-primary/40 hover:shadow-md transition-all duration-300 overflow-hidden">
      {link.thumbnailUrl && (
        <div className="aspect-square relative overflow-hidden bg-muted">
          <Image
            src={link.thumbnailUrl}
            alt={link.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardContent className="p-3 space-y-2">
        <Badge variant="outline" className={`text-xs ${pc?.color}`}>{pc?.label}</Badge>
        <p className="text-sm font-medium line-clamp-2 leading-snug">{link.title}</p>
        {link.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{link.description}</p>
        )}
        <Button
          size="sm"
          className="w-full h-8 text-xs gradient-brand text-white hover:opacity-90"
          onClick={handleClick}
        >
          <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Lihat Produk
        </Button>
      </CardContent>
    </Card>
  )
}