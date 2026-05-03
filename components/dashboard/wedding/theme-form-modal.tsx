"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { weddingThemeSchema, weddingCategories, type WeddingThemeInput } from "@/lib/validations/wedding"
import { createTheme, updateTheme } from "@/lib/actions/wedding"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, X } from "lucide-react"
import { toast } from "sonner"

interface Props {
  open: boolean
  onClose: () => void
  editData?: {
    id: string; name: string; category: string; price: number
    demoUrl: string; thumbnailUrl: string | null; description: string | null
    features: string[] | null; whatsappMsg: string | null
    sortOrder: number | null; isActive: boolean | null
  } | null
}

const categoryLabels: Record<string, string> = {
  minimalis: "Minimalis", modern: "Modern", islami: "Islami",
  rustic: "Rustic", royal: "Royal", floral: "Floral", vintage: "Vintage",
}

export function WeddingThemeFormModal({ open, onClose, editData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [features, setFeatures]     = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<WeddingThemeInput>({
      resolver: zodResolver(weddingThemeSchema),
      defaultValues: { isActive: true, sortOrder: 0, features: [] },
    })

  const isActive = watch("isActive")

  useEffect(() => {
    if (editData) {
      reset({
        name:         editData.name,
        category:     editData.category as any,
        price:        editData.price,
        demoUrl:      editData.demoUrl,
        thumbnailUrl: editData.thumbnailUrl ?? "",
        description:  editData.description ?? "",
        whatsappMsg:  editData.whatsappMsg ?? "",
        sortOrder:    editData.sortOrder ?? 0,
        isActive:     editData.isActive ?? true,
        features:     editData.features ?? [],
      })
      setFeatures(editData.features ?? [])
    } else {
      reset({ isActive: true, sortOrder: 0, features: [] })
      setFeatures([])
    }
  }, [editData, open, reset])

  function addFeature() {
    if (!newFeature.trim()) return
    const updated = [...features, newFeature.trim()]
    setFeatures(updated)
    setValue("features", updated)
    setNewFeature("")
  }

  function removeFeature(idx: number) {
    const updated = features.filter((_, i) => i !== idx)
    setFeatures(updated)
    setValue("features", updated)
  }

  function onSubmit(data: WeddingThemeInput) {
    startTransition(async () => {
      const res = editData
        ? await updateTheme(editData.id, { ...data, features })
        : await createTheme({ ...data, features })

      if (res.success) {
        toast.success(editData ? "Tema berhasil diupdate" : "Tema berhasil ditambahkan")
        onClose()
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Tema" : "Tambah Tema Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Row 1: name + category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Nama Tema *</Label>
              <Input placeholder="Contoh: Sakura Elegance" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Kategori *</Label>
              <Select
                defaultValue={editData?.category}
                onValueChange={(v) => setValue("category", v as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {weddingCategories.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {categoryLabels[c]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
          </div>

          {/* Row 2: price + sort */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Harga (Rp) *</Label>
              <Input type="number" placeholder="150000" {...register("price")} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Urutan Tampil</Label>
              <Input type="number" placeholder="0" {...register("sortOrder")} />
            </div>
          </div>

          {/* Demo URL */}
          <div className="space-y-1.5">
            <Label>URL Demo * <span className="text-xs text-muted-foreground">(https://...)</span></Label>
            <Input placeholder="https://demo.undangan.co/tema-sakura" {...register("demoUrl")} />
            {errors.demoUrl && <p className="text-xs text-destructive">{errors.demoUrl.message}</p>}
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-1.5">
            <Label>URL Thumbnail <span className="text-xs text-muted-foreground">(opsional)</span></Label>
            <Input placeholder="https://..." {...register("thumbnailUrl")} />
            {errors.thumbnailUrl && <p className="text-xs text-destructive">{errors.thumbnailUrl.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Deskripsi <span className="text-xs text-muted-foreground">(opsional)</span></Label>
            <Textarea placeholder="Deskripsi singkat tema..." rows={2} {...register("description")} />
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Fitur Tema <span className="text-xs text-muted-foreground">(opsional)</span></Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Contoh: Musik latar otomatis"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature() } }}
              />
              <Button type="button" size="sm" variant="outline" onClick={addFeature}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full"
                  >
                    {f}
                    <button type="button" onClick={() => removeFeature(i)}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp message */}
          <div className="space-y-1.5">
            <Label>Pesan WhatsApp Kustom <span className="text-xs text-muted-foreground">(opsional)</span></Label>
            <Textarea
              placeholder="Halo, saya tertarik dengan tema [nama tema]..."
              rows={2}
              {...register("whatsappMsg")}
            />
            <p className="text-xs text-muted-foreground">
              Kosongkan untuk menggunakan pesan default otomatis.
            </p>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3">
            <div>
              <p className="text-sm font-medium">Status Aktif</p>
              <p className="text-xs text-muted-foreground">
                Tema aktif akan tampil di halaman publik
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(v) => setValue("isActive", v)}
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 gradient-brand text-white hover:opacity-90"
            >
              {isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                : editData ? "Simpan Perubahan" : "Tambah Tema"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}