"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Heading2, Heading3, Quote, Undo, Redo, Link as LinkIcon, ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  content: string
  onChange: (html: string) => void
}

export function TiptapEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full my-4" } }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none min-h-[400px] p-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  if (!editor) return null

  function setLink() {
    const url = window.prompt("Masukkan URL:")
    if (!url) return
    editor.chain().focus().setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt("Masukkan URL gambar:")
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  const toolbarItems = [
    {
      icon: Heading2, label: "H2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: Heading3, label: "H3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: Bold, label: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      active: () => editor.isActive("bold"),
    },
    {
      icon: Italic, label: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      active: () => editor.isActive("italic"),
    },
    {
      icon: Strikethrough, label: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      active: () => editor.isActive("strike"),
    },
    {
      icon: Code, label: "Code",
      action: () => editor.chain().focus().toggleCode().run(),
      active: () => editor.isActive("code"),
    },
    {
      icon: List, label: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: () => editor.isActive("bulletList"),
    },
    {
      icon: ListOrdered, label: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: () => editor.isActive("orderedList"),
    },
    {
      icon: Quote, label: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: () => editor.isActive("blockquote"),
    },
  ]

  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border/50 bg-muted/30">
        {toolbarItems.map((item) => (
          <Button
            key={item.label}
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8",
              item.active() && "bg-primary/20 text-primary"
            )}
            onClick={item.action}
            title={item.label}
          >
            <item.icon className="w-4 h-4" />
          </Button>
        ))}
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={setLink} title="Insert Link">
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={addImage} title="Insert Image">
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button
          type="button" variant="ghost" size="icon" className="h-8 w-8"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button" variant="ghost" size="icon" className="h-8 w-8"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="bg-background" />
    </div>
  )
}