"use client"

import { useState, useTransition } from "react"
import { deleteTheme, toggleThemeStatus } from "@/lib/actions/wedding"
import { formatRupiah } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Plus, Eye, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { WeddingThemeFormModal } from "./theme-form-modal"

interface Theme {
  id: string; name: string; category: string; price: number
  demoUrl: string; thumbnailUrl: string | null; description: string | null
  features: string[] | null; whatsappMsg: string | null
  sortOrder: number | null; isActive: boolean | null; createdAt: Date | null
}

const categoryColor: Record<string, string> = {
  minimalis: "bg-slate-500/15 text-slate-300",
  modern:    "bg-blue-500/15 text-blue-400",
  islami:    "bg-green-500/15 text-green-400",
  rustic:    "bg-orange-500/15 text-orange-400",
  royal:     "bg-violet-500/15 text-violet-400",
  floral:    "bg-pink-500/15 text-pink-400",
  vintage:   "bg-amber-500/15 text-amber-400",
}

export function WeddingThemeManager({ themes: initial }: { themes: Theme[] }) {
  const [themes, setThemes]         = useState(initial)
  const [isPending, startTransition] = useTransition()
  const [formOpen, setFormOpen]     = useState(false)
  const [editTarget, setEditTarget] = useState<Theme | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Theme | null>(null)

  function handleEdit(theme: Theme) {
    setEditTarget(theme)
    setFormOpen(true)
  }

  function handleToggle(theme: Theme) {
    startTransition(async () => {
      const res = await toggleThemeStatus(theme.id, !theme.isActive)
      if (res.success) {
        toast.success(`Tema ${!theme.isActive ? "diaktifkan" : "dinonaktifkan"}`)
        setThemes((prev) =>
          prev.map((t) => (t.id === theme.id ? { ...t, isActive: !theme.isActive } : t))
        )
      } else {
        toast.error(res.error)
      }
    })
  }

  function handleDelete() {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = await deleteTheme(deleteTarget.id)
      if (res.success) {
        toast.success("Tema berhasil dihapus")
        setThemes((prev) => prev.filter((t) => t.id !== deleteTarget.id))
        setDeleteTarget(null)
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex justify-end">
        <Button
          className="gradient-brand text-white hover:opacity-90"
          onClick={() => { setEditTarget(null); setFormOpen(true) }}
        >
          <Plus className="w-4 h-4 mr-2" /> Tambah Tema
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead>Nama Tema</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead>Demo URL</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {themes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-16">
                  Belum ada tema. Klik "Tambah Tema" untuk mulai.
                </TableCell>
              </TableRow>
            ) : (
              themes.map((theme) => (
                <TableRow key={theme.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{theme.name}</p>
                      {theme.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {theme.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs ${categoryColor[theme.category] ?? ""}`}
                    >
                      {theme.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-sm">
                    {formatRupiah(theme.price)}
                  </TableCell>
                  <TableCell>
                    <a
                      href={theme.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      {theme.demoUrl.length > 30
                        ? theme.demoUrl.slice(0, 30) + "…"
                        : theme.demoUrl}
                    </a>
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={theme.isActive ?? false}
                      onCheckedChange={() => handleToggle(theme)}
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
                        <DropdownMenuItem onClick={() => handleEdit(theme)}>
                          <Pencil className="w-4 h-4 mr-2" /> Edit Tema
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a href={theme.demoUrl} target="_blank" rel="noopener noreferrer">
                            <Eye className="w-4 h-4 mr-2" /> Preview Demo
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setDeleteTarget(theme)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Hapus Tema
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

      {/* Form modal */}
      <WeddingThemeFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null) }}
        editData={editTarget}
      />

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus tema ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tema <strong>{deleteTarget?.name}</strong> akan dihapus permanen dan tidak bisa
              dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}