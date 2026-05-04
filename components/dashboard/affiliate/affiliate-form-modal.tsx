"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { affiliateLinkSchema, affiliatePlatforms, type AffiliateLinkInput } from "@/lib/validations/affiliate"
import { createAffiliateLink, updateAffiliateLink } from "@/lib/actions/affiliate"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  editData?: {
    id: string; title: string; platform: string; url: string
    thumbnailUrl: string | null; description: string | null
    tags: string[] | null; isActive: boolean | null
  } | null
}

const platformLabels: Record<string, string> = {
  shopee: "Shopee", tokopedia: "Tokopedia", tiktok_shop: "TikTok Shop",
}

export function AffiliateLinkFormModal({ open, onClose, editData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [tags, setTags]   = useState<string[]>([])
  const [newTag, setNewTag] = useState("")

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm({
      resolver: zodResolver(affiliateLinkSchema),
      defaultValues: { isActive: true, tags: [], thumbnailUrl: "", description: "" },
    })

  const isActive = watch("isActive")

  useEffect(() => {
    if (editData) {
      reset({
        title:        editData.title,
        platform:     editData.platform as any,
        url:          editData.url,
        thumbnailUrl: editData.thumbnailUrl ?? "",
        description:  editData.description ?? "",
        isActive:     editData.isActive ?? true,
        tags:         editData.tags ?? [],
      })
      setTags(editData.tags ?? [])
    } else {
      reset({ isActive: true, tags: [] })
      setTags([])
    }
  }, [editData, open, reset])

  function addTag() {
    if (!newTag.trim() || tags.includes(newTag.trim())) return
    const updated = [...tags, newTag.trim()]
    setTags(updated)
    setValue("tags", updated)
    setNewTag("")
  }

  function removeTag(idx: number) {
    const updated = tags.filter((_, i) => i !== idx)
    setTags(updated)
    setValue("tags", updated)
  }

  function onSubmit(data: AffiliateLinkInput) {
    startTransition(async () => {
      const res = editData
        ? await updateAffiliateLink(editData.id, { ...data, tags })
        : await createAffiliateLink({ ...data, tags })
      if (res.success) {
        toast.success(editData ? "Link berhasil diupdate" : "Link berhasil ditambahkan")
        onClose()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Link Affiliate" : "Tambah Link Affiliate"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Nama Produk *</Label>
            <Input placeholder="Nama produk affiliate" {...register("title")} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Platform *</Label>
            <Select defaultValue={editData?.platform} onValueChange={(v) => setValue("platform", v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih platform" />
              </SelectTrigger>
              <SelectContent>
                {affiliatePlatforms.map((p) => (
                  <SelectItem key={p} value={p}>{platformLabels[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.platform && <p className="text-xs text-destructive">{errors.platform.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>URL Affiliate *</Label>
            <Input placeholder="https://shp.ee/..." {...register("url")} />
            {errors.url && <p className="text-xs text-destructive">{errors.url.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>URL Thumbnail <span className="text-xs text-muted-foreground">(opsional)</span></Label>
            <Input placeholder="https://..." {...register("thumbnailUrl")} />
          </div>

          <div className="space-y-1.5">
            <Label>Deskripsi <span className="text-xs text-muted-foreground">(opsional)</span></Label>
            <Textarea placeholder="Deskripsi singkat produk..." rows={2} {...register("description")} />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags <span className="text-xs text-muted-foreground">(opsional)</span></Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Contoh: skincare, fashion..."
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
              />
              <Button type="button" size="sm" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((t, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full">
                    {t}
                    <button type="button" onClick={() => removeTag(i)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
            <p className="text-sm font-medium">Status Aktif</p>
            <Switch checked={isActive} onCheckedChange={(v) => setValue("isActive", v)} />
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={isPending} className="flex-1 gradient-brand text-white hover:opacity-90">
              {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : editData ? "Simpan" : "Tambah"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
