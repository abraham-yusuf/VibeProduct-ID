"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ExternalLink, Loader2, Check } from "lucide-react"
import { formatRupiah, getWhatsAppUrl } from "@/lib/utils"

interface Theme {
  id: string
  name: string
  category: string
  price: number
  demoUrl: string
  features: string[] | null
  whatsappMsg: string | null
}

interface Props {
  theme: Theme
  open: boolean
  onClose: () => void
}

// Sanitasi URL — hanya izinkan https
function sanitizeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== "https:") return null
    return url
  } catch {
    return null
  }
}

export function WeddingPreviewModal({ theme, open, onClose }: Props) {
  const [iframeLoading, setIframeLoading] = useState(true)

  const safeUrl = sanitizeEmbedUrl(theme.demoUrl)
  const waMsg   = theme.whatsappMsg ??
    `Halo, saya tertarik dengan tema undangan *${theme.name}* seharga ${formatRupiah(theme.price)}. Apakah masih tersedia?`
  const waUrl   = getWhatsAppUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "628000000000",
    waMsg
  )

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
        <div className="flex flex-col h-[90vh]">
          {/* Header */}
          <DialogHeader className="px-5 py-4 border-b border-border/50 flex-row items-center justify-between space-y-0 shrink-0">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-base">{theme.name}</DialogTitle>
              <Badge variant="outline" className="capitalize text-xs">
                {theme.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold gradient-brand-text text-base">
                {formatRupiah(theme.price)}
              </span>
              {safeUrl && (
                <Button asChild size="sm" variant="outline" className="h-8 text-xs">
                  <a href={safeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" /> Buka Tab Baru
                  </a>
                </Button>
              )}
              <Button
                asChild
                size="sm"
                className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-3 h-3 mr-1" /> Pesan Sekarang
                </a>
              </Button>
            </div>
          </DialogHeader>

          {/* iframe area */}
          <div className="relative flex-1 bg-muted/30">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Memuat preview...</p>
              </div>
            )}

            {safeUrl ? (
              <iframe
                src={safeUrl}
                className="w-full h-full border-0"
                onLoad={() => setIframeLoading(false)}
                title={`Preview tema ${theme.name}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                URL demo tidak valid atau tidak aman.
              </div>
            )}
          </div>

          {/* Footer features */}
          {theme.features && theme.features.length > 0 && (
            <div className="px-5 py-3 border-t border-border/50 bg-muted/20 shrink-0">
              <div className="flex flex-wrap gap-3">
                {theme.features.map((f) => (
                  <span
                    key={f}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  >
                    <Check className="w-3.5 h-3.5 text-primary" /> {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}