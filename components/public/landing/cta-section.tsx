"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWhatsAppUrl } from "@/lib/utils"

export function CTASection() {
  const waUrl = getWhatsAppUrl(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "628000000000",
    "Halo Vibe Product ID, saya ingin mengetahui lebih lanjut tentang layanan kalian."
  )

  return (
    <section className="py-24 container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden border border-violet-500/30 bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-background p-12 text-center"
      >
        {/* Decorative blobs */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-6 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold">
            Siap Mengembangkan{" "}
            <span className="gradient-brand-text">Bisnismu Sekarang?</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Bergabunglah dengan ratusan pelanggan yang sudah mempercayai Vibe Product ID
            untuk kebutuhan digital mereka.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="gradient-brand text-white hover:opacity-90 px-8 h-12 text-base"
            >
              <Link href="/smm">
                Mulai Sekarang <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8 h-12 text-base border-green-500/50 text-green-400 hover:bg-green-500/10">
              <a href={waUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" /> Chat WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}