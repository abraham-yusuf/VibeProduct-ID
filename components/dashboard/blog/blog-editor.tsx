"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogPostSchema, type BlogPostInput } from "@/lib/validations/blog"
import { createPost, updatePost } from "@/lib/actions/blog"
import { slugify } from "@/lib/utils"
import { TiptapEditor } from "./tiptap-editor"
import { AIGenerateModal } from "./ai-generate-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Save, X, Plus } from "lucide-react"
import { toast } from "sonner"

interface Category { id: string; name: string; slug: string }
interface InitialData {
  id: string; title: string; slug: string; content: string
  excerpt: string | null; thumbnailUrl: string | null; categoryId: string | null
  tags: string[] | null; status: string | null; metaTitle: string | null
  metaDesc: string | null; adsenseEnabled: boolean | null
}

interface Props {
  categories: Category[]
  initialData?: InitialData
}

export function BlogEditor({ categories, initialData }: Props) {
  const router   = useRouter()
  const [isPending, startTransition] = useTransition()
  const [content, setContent]  = useState(initialData?.content ?? "")
  const [tags, setTags]        = useState<string[]>(initialData?.tags ?? [])
  const [newTag, setNewTag]    = useState("")
  const [aiOpen, setAiOpen]    = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors } } =
    useForm<BlogPostInput>({
      resolver: zodResolver(blogPostSchema),
      defaultValues: {
        title:          initialData?.title ?? "",
        slug:           initialData?.slug ?? "",
        excerpt:        initialData?.excerpt ?? "",
        thumbnailUrl:   initialData?.thumbnailUrl ?? "",
        categoryId:     initialData?.categoryId ?? "",
        status:         (initialData?.status as any) ?? "draft",
        metaTitle:      initialData?.metaTitle ?? "",
        metaDesc:       initialData?.metaDesc ?? "",
        adsenseEnabled: initialData?.adsenseEnabled ?? false,
        tags:           initialData?.tags ?? [],
        content:        initialData?.content ?? "",
      },
    })

  const titleValue    = watch("title")
  const adsense       = watch("adsenseEnabled")
  const statusValue   = watch("status")

  // Auto-generate slug from title (new post only)
  function handleTitleBlur() {
    if (!initialData && titleValue) setValue("slug", slugify(titleValue))
  }

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

  function onSubmit(data: BlogPostInput) {
    startTransition(async () => {
      const payload = { ...data, content, tags }
      const res = initialData
        ? await updatePost(initialData.id, payload)
        : await createPost(payload)
      if (res.success) {
        toast.success(initialData ? "Artikel diperbarui!" : "Artikel berhasil disimpan!")
        router.push("/dashboard/blog")
      } else {
        toast.error(res.error)
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main editor — left 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label>Judul Artikel *</Label>
              <Input
                placeholder="Masukkan judul artikel..."
                className="text-lg h-12"
                {...register("title")}
                onBlur={handleTitleBlur}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label>Slug *</Label>
              <Input placeholder="judul-artikel-saya" {...register("slug")} />
              {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
            </div>

            {/* AI Generate button */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-dashed border-primary/40 bg-primary/5">
              <div>
                <p className="text-sm font-medium">Generate dengan AI</p>
                <p className="text-xs text-muted-foreground">Buat draft artikel otomatis menggunakan AI</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
                onClick={() => setAiOpen(true)}
              >
                <Sparkles className="w-4 h-4 mr-1.5" /> Generate AI
              </Button>
            </div>

            {/* Tiptap Editor */}
            <div className="space-y-1.5">
              <Label>Konten Artikel</Label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>

            {/* Excerpt */}
            <div className="space-y-1.5">
              <Label>Excerpt <span className="text-xs text-muted-foreground">(opsional — ringkasan artikel)</span></Label>
              <Textarea placeholder="Ringkasan singkat artikel..." rows={3} {...register("excerpt")} />
            </div>
          </div>

          {/* Sidebar — right 1/3 */}
          <div className="space-y-5">

            {/* Publish settings */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Pengaturan Publish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select
                    defaultValue={statusValue}
                    onValueChange={(v) => setValue("status", v as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">📝 Draft</SelectItem>
                      <SelectItem value="published">✅ Published</SelectItem>
                      <SelectItem value="scheduled">🕒 Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Kategori</Label>
                  <Select
                    defaultValue={initialData?.categoryId ?? ""}
                    onValueChange={(v) => setValue("categoryId", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Tanpa kategori</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Thumbnail URL</Label>
                  <Input placeholder="https://..." {...register("thumbnailUrl")} />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Tambah tag..."
                      className="h-8 text-sm"
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                    />
                    <Button type="button" size="sm" variant="outline" className="h-8" onClick={addTag}>
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((t, i) => (
                        <Badge key={i} variant="secondary" className="text-xs gap-1">
                          {t}
                          <button type="button" onClick={() => removeTag(i)}>
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Adsense toggle */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-sm font-medium">Google Adsense</p>
                    <p className="text-xs text-muted-foreground">Tampilkan iklan di artikel</p>
                  </div>
                  <Switch
                    checked={adsense ?? false}
                    onCheckedChange={(v) => setValue("adsenseEnabled", v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Meta Title</Label>
                  <Input placeholder="Judul untuk search engine..." {...register("metaTitle")} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Meta Description</Label>
                  <Textarea placeholder="Deskripsi artikel (150 karakter)..." rows={3} {...register("metaDesc")} />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/dashboard/blog")}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 gradient-brand text-white hover:opacity-90"
              >
                {isPending
                  ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                  : <><Save className="w-4 h-4 mr-2" /> Simpan</>
                }
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* AI Generate Modal */}
      <AIGenerateModal
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onGenerated={(html) => {
          setContent(html)
          toast.success("Konten berhasil di-generate!")
        }}
      />
    </>
  )
}