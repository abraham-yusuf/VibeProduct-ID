"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 gradient-hero pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 flex flex-col items-center text-center gap-8 py-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="px-4 py-1.5 border-violet-500/50 bg-violet-500/10 text-violet-400 text-sm">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Platform Digital Terpercaya Indonesia
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Semua Layanan Digital{" "}
            <span className="gradient-brand-text">Dalam Satu Platform</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SMM Panel, Undangan Pernikahan Digital, Blog, dan Ideathon — semua tersedia
            di Vibe Product ID untuk mendukung pertumbuhan digitalmu.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button asChild size="lg" className="gradient-brand text-white hover:opacity-90 px-8 h-12 text-base">
            <Link href="/smm">
              Lihat SMM Panel <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 h-12 text-base border-border/70">
            <Link href="/wedding">Undangan Digital</Link>
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
          <span>Dipercaya oleh ratusan pelanggan di seluruh Indonesia</span>
        </motion.div>

        {/* Floating cards — stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 w-full max-w-3xl"
        >
          {[
            { label: "Paket SMM", value: "50+" },
            { label: "Tema Wedding", value: "20+" },
            { label: "Artikel Blog", value: "100+" },
            { label: "Pelanggan", value: "500+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border/50 bg-card/50 backdrop-blur p-4 text-center"
            >
              <div className="text-2xl font-bold gradient-brand-text">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}