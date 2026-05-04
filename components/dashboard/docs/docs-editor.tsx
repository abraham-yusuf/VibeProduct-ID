"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { docsPageSchema, type DocsPageInput } from "@/lib/validations/docs"
import { createDocsPage, updateDocsPage } from "@/lib/actions/docs"
import { slugify } from "@/lib/utils"
import { TiptapEditor } from "@/components/dashboard/blog/tiptap-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save } from "lucide-react"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
}

interface InitialData {
  id: string
  categoryId: string
  title: string
  slug: string
  content: string
  adsenseEnabled: boolean
  sortOrder: number
  isPublished: boolean
}

interface Props {
  categories: Category[]
  initialCategoryId?: string
  initialData?: InitialData
}

export function DocsEditor({ categories, initialCategoryId, initialData }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [content, setContent] = useState(initialData?.content ?? "")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(docsPageSchema),
    defaultValues: {
      categoryId: initialData?.categoryId ?? initialCategoryId ?? categories[0]?.id ?? "",
      title: initialData?.title ?? "",
      slug: initialData?.slug ?? "",
      content: initialData?.content ?? "",
      adsenseEnabled: initialData?.adsenseEnabled ?? false,
      sortOrder: initialData?.sortOrder ?? 0,
      isPublished: initialData?.isPublished ?? true,
    },
  })

  const titleValue = watch("title")
  const categoryIdValue = watch("categoryId")
  const isPublishedValue = watch("isPublished")
  const adsenseValue = watch("adsenseEnabled")

  function handleTitleBlur() {
    if (!initialData && titleValue) setValue("slug", slugify(titleValue))
  }

  function onSubmit(data: DocsPageInput) {
    startTransition(async () => {
      const payload: DocsPageInput = { ...data, content }

      const res = initialData
        ? await updateDocsPage(initialData.id, payload)
        : await createDocsPage(payload)

      if (res.success) {
        toast.success(initialData ? "Halaman docs diperbarui" : "Halaman docs dibuat")
        router.push("/dashboard/docs")
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="space-y-1.5">
            <Label>Judul *</Label>
            <Input
              placeholder="Contoh: Cara Order Paket Followers"
              className="text-lg h-12"
              {...register("title")}
              onBlur={handleTitleBlur}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Slug *</Label>
            <Input placeholder="cara-order-paket-followers" {...register("slug")} />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Konten Halaman</Label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pengaturan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Kategori *</Label>
                <Select
                  value={categoryIdValue ?? ""}
                  onValueChange={(v) => setValue("categoryId", v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-xs text-destructive">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Urutan</Label>
                <Input type="number" min={0} {...register("sortOrder", { valueAsNumber: true })} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Published</p>
                  <p className="text-xs text-muted-foreground">Tampilkan halaman ke publik</p>
                </div>
                <Switch
                  checked={isPublishedValue ?? true}
                  onCheckedChange={(v) => setValue("isPublished", v)}
                />
              </div>

              <div className="flex items-center justify-between border-t border-border/30 pt-3">
                <div>
                  <p className="text-sm font-medium">Google Adsense</p>
                  <p className="text-xs text-muted-foreground">Tampilkan iklan di halaman</p>
                </div>
                <Switch
                  checked={adsenseValue ?? false}
                  onCheckedChange={(v) => setValue("adsenseEnabled", v)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/dashboard/docs")}>
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 gradient-brand text-white hover:opacity-90"
            >
              {isPending
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</>
                : <><Save className="w-4 h-4 mr-2" />Simpan</>
              }
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
