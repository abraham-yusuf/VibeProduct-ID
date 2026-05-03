import Image from "next/image"
import { Eye, MessageCircle, Check } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRupiah, getWhatsAppUrl } from "@/lib/utils"

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

const categoryColor: Record<string, string> = {
  minimalis: "bg-slate-500/15 text-slate-300 border-slate-500/25",
  modern:    "bg-blue-500/15 text-blue-400 border-blue-500/25",
  islami:    "bg-green-500/15 text-green-400 border-green-500/25",
  rustic:    "bg-orange-500/15 text-orange-400 border-orange-500/25",
  royal:     "bg-violet-500/15 text-violet-400 border-violet-500/25",
  floral:    "bg-pink-500/15 text-pink-400 border-pink-500/25",
  vintage:   "bg-amber-500/15 text-amber-400 border-amber-500/25",
}

interface Props {
  theme: Theme
  onPreview: () => void
}

export function WeddingThemeCard({ theme, onPreview }: Props) {
  const waMsg = theme.whatsappMsg ??
    `Halo, saya tertarik dengan tema undangan *${theme.name}* seharga ${formatRupiah(theme.price)}. Apakah masih tersedia?`
  const waUrl = getWhatsAppUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "628000000000",
    waMsg
  )

  return (
    <Card className="group flex flex-col overflow-hidden border-border/50 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {theme.thumbnailUrl ? (
          <Image
            src={theme.thumbnailUrl}
            alt={theme.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gradient-brand opacity-20">
            <span className="text-5xl">💍</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="sm"
            variant="secondary"
            onClick={onPreview}
            className="gap-2"
          >
            <Eye className="w-4 h-4" /> Preview Demo
          </Button>
        </div>

        <Badge
          variant="outline"
          className={`absolute top-3 left-3 text-xs capitalize ${categoryColor[theme.category] ?? ""}`}
        >
          {theme.category}
        </Badge>
      </div>

      <CardContent className="flex-1 pt-4 space-y-3">
        <div>
          <h3 className="font-semibold text-base">{theme.name}</h3>
          {theme.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {theme.description}
            </p>
          )}
        </div>

        {/* Features */}
        {theme.features && theme.features.length > 0 && (
          <ul className="space-y-1">
            {theme.features.slice(0, 3).map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                {f}
              </li>
            ))}
            {theme.features.length > 3 && (
              <li className="text-xs text-primary">
                +{theme.features.length - 3} fitur lainnya
              </li>
            )}
          </ul>
        )}

        <p className="text-xl font-bold gradient-brand-text">
          {formatRupiah(theme.price)}
        </p>
      </CardContent>

      <CardFooter className="gap-2 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 border-border/50"
          onClick={onPreview}
        >
          <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
        </Button>
        <Button
          asChild
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
        >
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Pesan
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}