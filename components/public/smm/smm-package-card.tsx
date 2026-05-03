import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Users } from "lucide-react"
import { formatRupiah } from "@/lib/utils"

interface Props {
  pkg: {
    id: string; name: string; description: string | null
    price: number; minQty: number | null; maxQty: number | null
  }
  platform: string
  onOrder: () => void
}

const platformColor: Record<string, string> = {
  instagram: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  tiktok:    "bg-slate-500/10 text-slate-300 border-slate-500/30",
  youtube:   "bg-red-500/10 text-red-400 border-red-500/30",
  twitter:   "bg-sky-500/10 text-sky-400 border-sky-500/30",
  facebook:  "bg-blue-500/10 text-blue-400 border-blue-500/30",
  telegram:  "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  spotify:   "bg-green-500/10 text-green-400 border-green-500/30",
}

export function SmmPackageCard({ pkg, platform, onOrder }: Props) {
  return (
    <Card className="flex flex-col border-border/50 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{pkg.name}</CardTitle>
          <Badge variant="outline" className={platformColor[platform] ?? ""}>
            {platform}
          </Badge>
        </div>
        {pkg.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            Min {(pkg.minQty ?? 100).toLocaleString("id-ID")} —{" "}
            Max {(pkg.maxQty ?? 100000).toLocaleString("id-ID")}
          </span>
        </div>
        <div className="text-2xl font-bold gradient-brand-text">
          {formatRupiah(pkg.price)}
          <span className="text-sm font-normal text-muted-foreground ml-1">/ item</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button onClick={onOrder} className="w-full gradient-brand text-white hover:opacity-90">
          <ShoppingCart className="w-4 h-4 mr-2" /> Pesan Sekarang
        </Button>
      </CardFooter>
    </Card>
  )
}