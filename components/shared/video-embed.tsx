"use client"

import { useState } from "react"
import { buildEmbedUrl, safeEmbedUrl, type EmbedType } from "@/lib/embed"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  url: string
  type: EmbedType
  className?: string
}

const aspectRatio: Record<EmbedType, string> = {
  youtube:   "aspect-video",
  tiktok:    "aspect-[9/16] max-w-xs mx-auto",
  facebook:  "aspect-video",
  instagram: "aspect-square max-w-sm mx-auto",
  none:      "aspect-video",
}

export function VideoEmbed({ url, type, className }: Props) {
  const [loading, setLoading] = useState(true)

  if (type === "none" || !url) return null

  const embedUrl = buildEmbedUrl(url, type)
  const safeUrl  = safeEmbedUrl(embedUrl)

  if (!safeUrl) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border/50 bg-muted/30 p-8 text-sm text-muted-foreground">
        URL video tidak valid atau tidak aman.
      </div>
    )
  }

  return (
    <div className={cn("relative w-full rounded-xl overflow-hidden bg-black", aspectRatio[type], className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
      <iframe
        src={safeUrl}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoading(false)}
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        title="Embedded video"
      />
    </div>
  )
}