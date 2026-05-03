import {
  pgTable, text, integer, boolean, timestamp, uuid, pgEnum,
} from "drizzle-orm/pg-core"

export const weddingCategoryEnum = pgEnum("wedding_category", [
  "minimalis", "modern", "islami", "rustic", "royal", "floral", "vintage",
])

export const weddingThemes = pgTable("wedding_themes", {
  id:           uuid("id").primaryKey().defaultRandom(),
  name:         text("name").notNull(),
  category:     weddingCategoryEnum("category").notNull(),
  price:        integer("price").notNull(),             // dalam rupiah
  demoUrl:      text("demo_url").notNull(),             // URL embed iframe
  thumbnailUrl: text("thumbnail_url"),                  // gambar preview
  description:  text("description"),
  features:     text("features").array(),               // list fitur tema
  whatsappMsg:  text("whatsapp_msg"),                   // custom WA message
  sortOrder:    integer("sort_order").default(0),
  isActive:     boolean("is_active").default(true),
  createdAt:    timestamp("created_at").defaultNow(),
  updatedAt:    timestamp("updated_at").defaultNow(),
})