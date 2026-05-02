"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Zap, Headphones, BadgePercent, Clock, ThumbsUp } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Proses Cepat",
    description: "Order SMM diproses dalam hitungan menit setelah pembayaran terkonfirmasi.",
  },
  {
    icon: BadgePercent,
    title: "Harga Terjangkau",
    description: "Harga kompetitif dengan kualitas terjamin, cocok untuk semua kalangan.",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Terpercaya",
    description: "Pembayaran aman via Midtrans. Data dan privasi pelanggan selalu terlindungi.",
  },
  {
    icon: Headphones,
    title: "Support Responsif",
    description: "Tim kami siap membantu via WhatsApp kapanpun kamu butuhkan.",
  },
  {
    icon: Clock,
    title: "Tersedia 24/7",
    description: "Platform online 24 jam. Order dan akses layanan kapan saja, di mana saja.",
  },
  {
    icon: ThumbsUp,
    title: "Garansi Kepuasan",
    description: "Tidak puas? Kami siap memberikan solusi terbaik untuk setiap keluhan.",
  },
]

export function WhyUsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-14 space-y-3">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-medium text-primary uppercase tracking-widest"
          >
            Kenapa Kami
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold"
          >
            Mengapa Pilih Vibe Product ID?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Kami berkomitmen memberikan layanan digital terbaik dengan pengalaman berbelanja
            yang mudah, aman, dan menyenangkan.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 p-6 rounded-xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-300"
            >
              <div className="shrink-0 p-2.5 h-fit rounded-xl bg-primary/10 text-primary">
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}