import Link from "next/link"
import { Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const links = {
  Layanan: [
    { href: "/smm",      label: "SMM Panel" },
    { href: "/wedding",  label: "Wedding Invitation" },
    { href: "/blog",     label: "Blog" },
    { href: "/ideathon", label: "Ideathon" },
  ],
  Bantuan: [
    { href: "/docs",               label: "Dokumentasi" },
    { href: "/docs/cara-order",    label: "Cara Order" },
    { href: "/docs/pembayaran",    label: "Metode Pembayaran" },
    { href: "/docs/refund",        label: "Kebijakan Refund" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg gradient-brand">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg gradient-brand-text">Vibe Product ID</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Platform digital multi-layanan terpercaya untuk kebutuhan sosial media,
              undangan digital, dan konten inspiratif.
            </p>
            <p className="text-xs text-muted-foreground">
              📍 Indonesia &nbsp;|&nbsp; 🌐 vibeproduct.biz.id
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title} className="space-y-4">
              <h4 className="text-sm font-semibold">{title}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-border/50" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Vibe Product ID. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/docs/privacy" className="hover:text-foreground transition-colors">
              Kebijakan Privasi
            </Link>
            <Link href="/docs/terms" className="hover:text-foreground transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}