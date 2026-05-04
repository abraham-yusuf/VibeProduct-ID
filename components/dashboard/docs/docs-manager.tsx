"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  createDocsCategory, deleteDocsCategory, deleteDocsPage,
} from "@/lib/actions/docs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, FileText, FolderOpen } from "lucide-react"
import { toast } from "sonner"
import { slugify } from "@/lib/utils"

interface Page     { id: string; title: string; slug: string; isPublished: boolean | null; sortOrder: number | null }
interface Category { id: string; name: string; slug: string; sortOrder: number | null; pages: Page[] }

export function DocsDashboardManager({ categories: initial }: { categories: Category[] }) {
  const [categories, setCategories]  = useState(initial)
  const [expanded, setExpanded]      = useState<Record<string, boolean>>({})
  const [newCatName, setNewCatName]  = useState("")
  const [deleteTarget, setDelete]    = useState<{ type: "category" | "page"; id: string; name: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggleExpand(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function handleAddCategory() {
    if (!newCatName.trim()) return
    startTransition(async () => {
      const res = await createDocsCategory({
        name: newCatName.trim(),
        slug: slugify(newCatName.trim()),
        sortOrder: categories.length,
      })
      if (res.success) {
        toast.success("Kategori ditambahkan")
        setNewCatName("")
      } else toast.error(res.error)
    })
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    startTransition(async () => {
      const res = deleteTarget.type === "category"
        ? await deleteDocsCategory(deleteTarget.id)
        : await deleteDocsPage(deleteTarget.id)
      if (res.success) {
        toast.success(`${deleteTarget.type === "category" ? "Kategori" : "Halaman"} dihapus`)
        setDelete(null)
      } else toast.error(res.error)
    })
  }

  return (
    <>
      <div className="space-y-4">
        {/* Add category */}
        <div className="flex gap-2">
          <Input
            placeholder="Nama kategori baru..."
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory() }}
            className="max-w-xs"
          />
          <Button
            onClick={handleAddCategory}
            disabled={isPending || !newCatName.trim()}
            size="sm"
            className="gradient-brand text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Tambah Kategori
          </Button>
        </div>

        {/* Category tree */}
        {categories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/50 py-16 text-center text-muted-foreground text-sm">
            Belum ada kategori. Tambahkan kategori untuk mulai membuat dokumentasi.
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-xl border border-border/50 overflow-hidden">
                {/* Category header */}
                <div
                  className="flex items-center justify-between px-4 py-3 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleExpand(cat.id)}
                >
                  <div className="flex items-center gap-2">
                    {expanded[cat.id]
                      ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      : <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    }
                    <FolderOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{cat.name}</span>
                    <Badge variant="outline" className="text-xs">{cat.pages.length} halaman</Badge>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button asChild variant="ghost" size="sm" className="h-7 text-xs">
                      <Link href={`/dashboard/docs/new?categoryId=${cat.id}`}>
                        <Plus className="w-3.5 h-3.5 mr-1" /> Halaman
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDelete({ type: "category", id: cat.id, name: cat.name })}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Pages list */}
                {expanded[cat.id] && (
                  <div className="divide-y divide-border/30">
                    {cat.pages.length === 0 ? (
                      <p className="px-10 py-4 text-xs text-muted-foreground">
                        Belum ada halaman di kategori ini.
                      </p>
                    ) : (
                      cat.pages.map((page) => (
                        <div
                          key={page.id}
                          className="flex items-center justify-between px-10 py-3 hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-sm">{page.title}</span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${page.isPublished ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"}`}
                            >
                              {page.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                              <Link href={`/dashboard/docs/${page.id}/edit`}>
                                <Pencil className="w-3.5 h-3.5" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => setDelete({ type: "page", id: page.id, name: page.title })}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Hapus {deleteTarget?.type === "category" ? "kategori" : "halaman"} ini?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{deleteTarget?.name}</strong> akan dihapus permanen.
              {deleteTarget?.type === "category" && " Semua halaman di dalamnya juga akan dihapus."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
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