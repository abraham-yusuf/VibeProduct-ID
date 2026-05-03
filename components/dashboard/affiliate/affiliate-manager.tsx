"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { deleteAffiliateLink, toggleAffiliateLinkStatus } from "@/lib/actions/affiliate"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, MoreHorizontal, Pencil, Trash2, ExternalLink, Search } from "lucide-react"
import { toast } from "sonner"
import { AffiliateLinkFormModal } from "./affiliate-form-modal"

interface Link {
  id: string; title: string; platform: string; url: string
  thumbnailUrl: string | null; description: string | null
  tags: string[] | null; clickCount: number | null
  isActive: boolean | null; createdAt: Date | null
}

const platformConfig: Record<string, { label: string; color: string }> = {
  shopee:     { label: "Shopee",      color: "bg-orange-500/15 text-orange-400 border-orange-500/25" },
  tokopedia:  { label: "Tokopedia",   color: "bg-green-500/15 text-green-400 border-green-500/25" },
  tiktok_shop:{ label: "TikTok Shop", color: "bg-pink-500/15 text-pink-400 border-pink-500/25" },
}

export function AffiliateLinkManager({ links: initial }: { links: Link[] }) {
  const [links, setLinks]             = useState(initial)
  const [search, setSearch]           = useState("")
  const [filterPlatform, setFilter]   = useState<string>("all")
  const [formOpen, setFormOpen]       = useState(false)
  const [editTarget, setEditTarget]   = useState<Link | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Link | null>(null)
  const [isPending, startTransition]  = useTransition()

  const filtered = links.filter((l) => {
    const matchSearch   = l.title.toLowerCase().includes(search.toLowerCase())
    const matchPlatform = filterPlatform === "all" || l.platform === filterPlatform
    return matchSearch && matchPlatform
  })

  function handleEdit(link: Link) {
    setEditTarget(link)
    setFormOpen(true)
  }

  function handleToggle(link: Link) {
    startTransition(async () => {
      const res = await toggleAffiliateLinkStatus(link.id, !link.isActive)
      if (res.success) {
        setLinks((prev) => prev.map((l) => l.id === link.id ? { ...l, isActive: !link.isActive } : l))
        toast.success(`Link ${!link.isActive ? "diaktifkan" : "dinonaktifkan"}`)
      } else toast.error(res.error)
    })
  }

  function handleDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await deleteAffiliateLink(deleteTarget.id)
      if (res.success) {
        setLinks((prev) => prev.filter((l) => l.id !== deleteTarget.id))
        toast.success("Link berhasil dihapus")
        setDeleteTarget(null)
      } else toast.error(res.error)
    })
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "shopee", "tokopedia", "tiktok_shop"].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filterPlatform === p
                  ? "gradient-brand text-white border-transparent"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "all" ? "Semua" : platformConfig[p]?.label}
            </button>
          ))}
        </div>
        <Button
          className="gradient-brand text-white hover:opacity-90 shrink-0"
          onClick={() => { setEditTarget(null); setFormOpen(true) }}
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Link
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Produk</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-center">Klik</TableHead>
              <TableHead className="text-center">Aktif</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-16">
                  {links.length === 0 ? "Belum ada link affiliate." : "Tidak ada hasil yang cocok."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((link) => (
                <TableRow key={link.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {link.thumbnailUrl ? (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                          <Image
                            src={link.thumbnailUrl}
                            alt={link.title}
                            width={40} height={40}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 text-lg">
                          🛍️
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{link.title}</p>
                        {link.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">{link.description}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${platformConfig[link.platform]?.color}`}>
                      {platformConfig[link.platform]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(link.tags ?? []).slice(0, 3).map((t) => (
                        <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                          {t}
                        </span>
                      ))}
                      {(link.tags ?? []).length > 3 && (
                        <span className="text-xs text-muted-foreground">+{(link.tags ?? []).length - 3}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium">
                    {(link.clickCount ?? 0).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={link.isActive ?? false}
                      onCheckedChange={() => handleToggle(link)}
                      disabled={isPending}
                    />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(link)}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" /> Buka Link
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(link)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AffiliateLinkFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        editData={editTarget}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus link ini?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.title}</strong> akan dihapus permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete} disabled={isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}