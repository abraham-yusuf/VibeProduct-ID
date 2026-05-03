import {
  pgTable, text, boolean, integer, timestamp, uuid,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const docsCategories = pgTable("docs_categories", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      text("name").notNull(),
  slug:      text("slug").notNull().unique(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})

export const docsPages = pgTable("docs_pages", {
  id:             uuid("id").primaryKey().defaultRandom(),
  categoryId:     uuid("category_id").notNull().references(() => docsCategories.id, { onDelete: "cascade" }),
  title:          text("title").notNull(),
  slug:           text("slug").notNull().unique(),
  content:        text("content").default(""),
  adsenseEnabled: boolean("adsense_enabled").default(false),
  sortOrder:      integer("sort_order").default(0),
  isPublished:    boolean("is_published").default(true),
  createdAt:      timestamp("created_at").defaultNow(),
  updatedAt:      timestamp("updated_at").defaultNow(),
})

// Relations
export const docsCategoriesRelations = relations(docsCategories, ({ many }) => ({
  pages: many(docsPages),
}))

export const docsPagesRelations = relations(docsPages, ({ one }) => ({
  category: one(docsCategories, {
    fields: [docsPages.categoryId],
    references: [docsCategories.id],
  }),
}))