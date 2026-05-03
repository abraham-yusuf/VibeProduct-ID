"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface Props {
  position: "header" | "content" | "footer"
  className?: string
}

// Ganti dengan Ad Unit ID dari Google Adsense kamu setelah approved
const AD_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ""
const AD_SLOTS: Record<string, string> = {
  header:  process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER  ?? "",
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT ?? "",
  footer:  process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER  ?? "",
}

export function AdSlot({ position, className }: Props) {
  const adRef  = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (!AD_CLIENT || !AD_SLOTS[position] || pushed.current) return
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {}
  }, [position])

  // Jika belum ada Adsense ID, tampilkan placeholder di development
  if (!AD_CLIENT) {
    return (
      <div
        className={cn(
          "w-full flex items-center justify-center rounded-xl border border-dashed border-border/40 bg-muted/20 text-muted-foreground text-xs py-6",
          position === "header" || position === "footer" ? "h-24" : "h-16",
          className
        )}
      >
        Ad Slot — {position} (Aktif setelah Adsense approved)
      </div>
    )
  }

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={AD_SLOTS[position]}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}