"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, TrendingUp, Heart, Link2,
  BookOpen, Lightbulb, FileText, Settings, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard",            label: "Overview",    icon: LayoutDashboard },
  { href: "/dashboard/smm",        label: "SMM Panel",   icon: TrendingUp },
  { href: "/dashboard/wedding",    label: "Wedding",     icon: Heart },
  { href: "/dashboard/affiliate",  label: "Affiliate",   icon: Link2 },
  { href: "/dashboard/blog",       label: "Blog",        icon: BookOpen },
  { href: "/dashboard/ideathon",   label: "Ideathon",    icon: Lightbulb },
  { href: "/dashboard/docs",       label: "Docs",        icon: FileText },
  { href: "/dashboard/settings",   label: "Settings",    icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 border-r border-border/50 bg-card/30 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 h-16 border-b border-border/50">
        <div className="p-1.5 rounded-lg gradient-brand">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold gradient-brand-text">Vibe Product ID</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">v1.0.0 · vibeproduct.biz.id</p>
      </div>
    </aside>
  )
}