import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { TrendingUp, Heart, Link2, BookOpen, Lightbulb, FileText, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const modules = [
  { href: "/dashboard/smm",       label: "SMM Panel",  icon: TrendingUp, color: "text-violet-400",  desc: "Kelola paket & order" },
  { href: "/dashboard/wedding",   label: "Wedding",    icon: Heart,      color: "text-pink-400",    desc: "Kelola tema undangan" },
  { href: "/dashboard/affiliate", label: "Affiliate",  icon: Link2,      color: "text-blue-400",    desc: "Kelola link affiliate" },
  { href: "/dashboard/blog",      label: "Blog",       icon: BookOpen,   color: "text-green-400",   desc: "Tulis & publish artikel" },
  { href: "/dashboard/ideathon",  label: "Ideathon",   icon: Lightbulb,  color: "text-amber-400",   desc: "Kurasi ide bisnis" },
  { href: "/dashboard/docs",      label: "Docs",       icon: FileText,   color: "text-cyan-400",    desc: "Kelola dokumentasi" },
]

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Selamat Pagi" : hour < 17 ? "Selamat Siang" : "Selamat Malam"

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting}, {session?.user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang di dashboard Vibe Product ID. Pilih modul yang ingin kamu kelola.
        </p>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <Card key={m.href} className="border-border/50 hover:border-primary/40 transition-all hover:shadow-md group">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <m.icon className={`w-5 h-5 ${m.color}`} />
                <Button asChild variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs">
                  <Link href={m.href}>Buka <ArrowRight className="w-3 h-3 ml-1" /></Link>
                </Button>
              </div>
              <CardTitle className="text-base mt-2">{m.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{m.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick info */}
      <Card className="border-border/50 bg-primary/5">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <span className="font-medium text-foreground">Tips:</span> Mulai dengan menambahkan
            paket SMM dan tema Wedding Invitation agar platform siap menerima order pertamamu.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}