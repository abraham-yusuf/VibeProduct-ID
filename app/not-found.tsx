import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Zap } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 gradient-hero">
      <div className="p-3 rounded-2xl gradient-brand mb-6">
        <Zap className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-8xl font-extrabold gradient-brand-text mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Halaman yang kamu cari tidak ada atau sudah dipindahkan.
      </p>
      <Button asChild className="gradient-brand text-white hover:opacity-90">
        <Link href="/">
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
        </Link>
      </Button>
    </div>
  )
}