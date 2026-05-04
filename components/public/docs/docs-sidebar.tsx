"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronDown, ChevronRight, BookOpen, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface Page     { id: string; title: string; slug: string }
interface Category { id: string; name: string; slug: string; pages: Page[] }

export function DocsSidebar({ categories }: { categories: Category[] }) {
  const pathname  = usePathname()
  const [open, setOpen] = useState<Record<string, boolean>>(
    // Default: open all categories
    Object.fromEntries(categories.map((c) => [c.id, true]))
  )

  function toggle(id: string) {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <aside className="hidden md:block w-60 shrink-0">
      <div className="sticky top-24 space-y-1">
        <div className="flex items-center gap-2 px-3 py-2 mb-3">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Dokumentasi</span>
        </div>

        {categories.map((cat) => (
          <div key={cat.id}>
            {/* Category toggle */}
            <button
              onClick={() => toggle(cat.id)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              {open[cat.id]
                ? <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                : <ChevronRight className="w-3.5 h-3.5 shrink-0" />
              }
              {cat.name}
            </button>

            {/* Pages */}
            {open[cat.id] && cat.pages.length > 0 && (
              <div className="ml-3 pl-3 border-l border-border/50 space-y-0.5 mb-1">
                {cat.pages.map((page) => {
                  const active = pathname === `/docs/${page.slug}`
                  return (
                    <Link
                      key={page.id}
                      href={`/docs/${page.slug}`}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                        active
                          ? "bg-primary/15 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      <span className="line-clamp-1">{page.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <p className="px-3 py-2 text-xs text-muted-foreground">
            Belum ada dokumentasi tersedia.
          </p>
        )}
      </div>
    </aside>
  )
}