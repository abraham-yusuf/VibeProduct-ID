import {
  pgTable, text, boolean, timestamp, uuid, pgEnum,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const embedTypeEnum = pgEnum("embed_type", [
  "youtube", "tiktok", "facebook", "instagram", "none",
])

export const ideathonCategories = pgTable("ideathon_categories", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      text("name").notNull(),
  slug:      text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const ideathonPosts = pgTable("ideathon_posts", {
  id:             uuid("id").primaryKey().defaultRandom(),
  title:          text("title").notNull(),
  slug:           text("slug").notNull().unique(),
  content:        text("content").default(""),
  thumbnailUrl:   text("thumbnail_url"),
  categoryId:     uuid("category_id").references(() => ideathonCategories.id, { onDelete: "set null" }),
  tags:           text("tags").array().default([]),
  embedUrl:       text("embed_url"),
  embedType:      embedTypeEnum("embed_type").default("none"),
  adsenseEnabled: boolean("adsense_enabled").default(false),
  isPublished:    boolean("is_published").default(false),
  publishedAt:    timestamp("published_at"),
  createdAt:      timestamp("created_at").defaultNow(),
  updatedAt:      timestamp("updated_at").defaultNow(),
})

// Relations
export const ideathonCategoriesRelations = relations(ideathonCategories, ({ many }) => ({
  posts: many(ideathonPosts),
}))

export const ideathonPostsRelations = relations(ideathonPosts, ({ one }) => ({
  category: one(ideathonCategories, {
    fields: [ideathonPosts.categoryId],
    references: [ideathonCategories.id],
  }),
}))