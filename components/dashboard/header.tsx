"use client"

import { useRouter } from "next/navigation"
import { LogOut, ExternalLink, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { signOut } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"
import { toast } from "sonner"

interface Props {
  user: { name: string; email: string; image?: string | null }
}

export function DashboardHeader({ user }: Props) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    toast.success("Berhasil keluar")
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header className="h-16 border-b border-border/50 bg-card/30 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-sm font-semibold text-foreground">Dashboard Admin</h1>
        <p className="text-xs text-muted-foreground">Vibe Product ID</p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-1.5" /> Lihat Website
          </a>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg p-1 hover:bg-accent/50 transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="gradient-brand text-white text-xs font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <User className="w-4 h-4 mr-2" /> Profil & Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
              <LogOut className="w-4 h-4 mr-2" /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}