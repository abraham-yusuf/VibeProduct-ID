"use client"

import { motion } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Berapa lama proses order SMM Panel?",
    a: "Setelah pembayaran terkonfirmasi, proses order dimulai dalam 1–15 menit tergantung jenis layanan. Followers biasanya mulai bertambah dalam 30 menit hingga 24 jam.",
  },
  {
    q: "Apakah followers/likes yang diberikan aman untuk akun saya?",
    a: "Ya, semua layanan kami menggunakan metode yang aman dan tidak melanggar ketentuan platform sosial media. Namun kami tetap menyarankan untuk tidak memesan dalam jumlah sangat besar sekaligus.",
  },
  {
    q: "Bagaimana cara memesan Wedding Invitation?",
    a: "Pilih tema yang kamu suka, klik tombol 'Pesan via WhatsApp', lalu tim kami akan menghubungimu untuk diskusi lebih lanjut mengenai detail undangan, nama, tanggal, dan informasi lainnya.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima berbagai metode pembayaran melalui Midtrans, termasuk transfer bank (BCA, BNI, BRI, Mandiri), QRIS, GoPay, OVO, Dana, dan kartu kredit/debit.",
  },
  {
    q: "Apakah ada garansi jika order tidak selesai?",
    a: "Ya, jika order tidak dapat diselesaikan karena kesalahan dari pihak kami, kami akan memberikan refund penuh atau menggantinya dengan layanan lain yang setara.",
  },
  {
    q: "Bisakah saya request tema Wedding Invitation kustom?",
    a: "Tentu! Hubungi kami via WhatsApp untuk mendiskusikan kebutuhan kustom. Kami menerima request desain khusus dengan biaya dan waktu pengerjaan yang akan disetujui bersama.",
  },
]

export function FAQSection() {
  return (
    <section className="py-24 container max-w-3xl">
      <div className="text-center mb-14 space-y-3">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-sm font-medium text-primary uppercase tracking-widest"
        >
          FAQ
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold"
        >
          Pertanyaan Umum
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Tidak menemukan jawaban yang kamu cari?{" "}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            Hubungi kami
          </a>
          .
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-border/50 rounded-xl px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}