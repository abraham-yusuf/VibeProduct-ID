"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { TrendingUp, Heart, BookOpen, Lightbulb, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const services = [
  {
    icon: TrendingUp,
    title: "SMM Panel",
    description:
      "Tingkatkan followers, likes, dan views sosial media kamu dengan paket terjangkau dan proses cepat.",
    href: "/smm",
    badge: "Populer",
    badgeColor: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    gradient: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
  },
  {
    icon: Heart,
    title: "Wedding Invitation",
    description:
      "Website undangan pernikahan digital yang elegan dan berkesan dengan berbagai pilihan tema premium.",
    href: "/wedding",
    badge: "Trending",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    gradient: "from-pink-500/20 to-rose-500/10",
    iconColor: "text-pink-400",
  },
  {
    icon: BookOpen,
    title: "Blog",
    description:
      "Artikel informatif dan tips seputar dunia digital, bisnis, dan teknologi yang ditulis oleh para ahli.",
    href: "/blog",
    badge: "Baru",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    gradient: "from-blue-500/20 to-cyan-500/10",
    iconColor: "text-blue-400",
  },
  {
    icon: Lightbulb,
    title: "Ideathon",
    description:
      "Temukan inspirasi dan ide bisnis terbaik dari kurasi konten video dan artikel yang kami pilihkan.",
    href: "/ideathon",
    badge: "Unik",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    gradient: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-400",
  },
]

export function ServicesSection() {
  return (
    <section className="py-24 container">
      <div className="text-center mb-14 space-y-3">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-primary uppercase tracking-widest"
        >
          Layanan Kami
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold"
        >
          Semua yang Kamu Butuhkan
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-xl mx-auto"
        >
          Dari pemasaran sosial media hingga undangan digital, kami hadir untuk membantu
          pertumbuhan bisnis dan momen spesialmu.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((s, i) => (
          <motion.div
            key={s.href}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={s.href}>
              <Card className={cn(
                "h-full group cursor-pointer border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 overflow-hidden"
              )}>
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br", s.gradient)} />
                <CardHeader className="relative">
                  <div className="flex items-start justify-between">
                    <div className={cn("p-2.5 rounded-xl bg-card border border-border/50", s.iconColor)}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className={cn("text-xs", s.badgeColor)}>
                      {s.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-3">{s.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {s.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <span className={cn("text-sm font-medium flex items-center gap-1 transition-gap group-hover:gap-2", s.iconColor)}>
                    Selengkapnya <ArrowRight className="w-4 h-4" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}