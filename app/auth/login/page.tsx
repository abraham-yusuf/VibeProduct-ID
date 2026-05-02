"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Zap } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleLogin() {
    if (!email || !password) {
      toast.error("Email dan password wajib diisi")
      return
    }
    setLoading(true)
    const { error } = await signIn.email({ email, password })
    if (error) {
      toast.error(error.message ?? "Login gagal. Periksa kembali kredensial Anda.")
    } else {
      toast.success("Login berhasil! Mengalihkan...")
      router.push("/dashboard")
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background gradient-hero px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl gradient-brand">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-brand-text">Vibe Product ID</span>
          </div>
          <p className="text-muted-foreground text-sm">Admin Dashboard</p>
        </div>

        {/* Card login */}
        <Card className="border-border/50 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Masuk ke Dashboard</CardTitle>
            <CardDescription>Gunakan email dan password admin Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vibeproduct.biz.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                disabled={loading}
              />
            </div>
            <Button
              className="w-full gradient-brand text-white hover:opacity-90 transition-opacity"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
              ) : (
                "Masuk"
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vibe Product ID. All rights reserved.
        </p>
      </div>
    </div>
  )
}