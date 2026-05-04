import { db } from "@/lib/db"
import { aiSettings } from "@/lib/db/schema/blog"
import { AISettingsForm } from "@/components/dashboard/settings/ai/ai-settings-form"

export default async function AISettingsPage() {
  const settings = await db.select().from(aiSettings)

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan AI</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Atur provider dan API key untuk fitur generate konten blog
        </p>
      </div>
      <AISettingsForm initialSettings={settings} />
    </div>
  )
}
