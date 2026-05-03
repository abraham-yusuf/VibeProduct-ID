import { db } from "@/lib/db"
import { weddingThemes } from "@/lib/db/schema/wedding"
import { eq } from "drizzle-orm"
import { WeddingGallery } from "@/components/public/wedding/wedding-gallery"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description:
    "Jasa pembuatan website undangan pernikahan digital yang elegan dengan berbagai pilihan tema premium.",
}

export default async function WeddingPage() {
  const themes = await db
    .select()
    .from(weddingThemes)
    .where(eq(weddingThemes.isActive, true))
    .orderBy(weddingThemes.sortOrder)

  return (
    <div className="container py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-widest">
          Wedding Invitation
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">
          Undangan Pernikahan Digital
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Buat momen pernikahanmu tak terlupakan dengan undangan digital yang elegan,
          modern, dan mudah dibagikan ke semua tamu.
        </p>
      </div>

      {/* Features highlight */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {[
          { emoji: "📱", label: "Mobile Friendly" },
          { emoji: "🎵", label: "Musik Latar" },
          { emoji: "📍", label: "Peta Lokasi" },
          { emoji: "💌", label: "RSVP Online" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 bg-card/50 text-center"
          >
            <span className="text-2xl">{f.emoji}</span>
            <span className="text-xs font-medium text-muted-foreground">{f.label}</span>
          </div>
        ))}
      </div>

      <WeddingGallery themes={themes} />

      {/* CTA bottom */}
      <div className="text-center space-y-3 py-8 border-t border-border/30">
        <p className="text-muted-foreground">
          Tidak menemukan tema yang cocok? Kami bisa membuat tema kustom untukmu.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
            "Halo, saya ingin request tema undangan kustom. Bisa dibantu?"
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/25 transition-colors"
        >
          💬 Request Tema Kustom
        </a>
      </div>
    </div>
  )
}