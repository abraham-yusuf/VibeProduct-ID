import {
  pgTable, text, boolean, timestamp, uuid, pgEnum,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const blogStatusEnum = pgEnum("blog_status", [
  "draft", "published", "scheduled",
])

export const aiProviderEnum = pgEnum("ai_provider", [
  "openai", "anthropic", "openrouter",
])

export const blogCategories = pgTable("blog_categories", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      text("name").notNull(),
  slug:      text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
})

export const blogPosts = pgTable("blog_posts", {
  id:             uuid("id").primaryKey().defaultRandom(),
  title:          text("title").notNull(),
  slug:           text("slug").notNull().unique(),
  content:        text("content").notNull().default(""),
  excerpt:        text("excerpt"),
  thumbnailUrl:   text("thumbnail_url"),
  categoryId:     uuid("category_id").references(() => blogCategories.id, { onDelete: "set null" }),
  tags:           text("tags").array().default([]),
  status:         blogStatusEnum("status").default("draft"),
  metaTitle:      text("meta_title"),
  metaDesc:       text("meta_desc"),
  ogImage:        text("og_image"),
  adsenseEnabled: boolean("adsense_enabled").default(false),
  publishedAt:    timestamp("published_at"),
  scheduledAt:    timestamp("scheduled_at"),
  createdAt:      timestamp("created_at").defaultNow(),
  updatedAt:      timestamp("updated_at").defaultNow(),
})

export const aiSettings = pgTable("ai_settings", {
  id:        uuid("id").primaryKey().defaultRandom(),
  provider:  aiProviderEnum("provider").notNull(),
  apiKey:    text("api_key").notNull(),
  model:     text("model").notNull(),
  isActive:  boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Relations
export const blogCategoriesRelations = relations(blogCategories, ({ many }) => ({
  posts: many(blogPosts),
}))

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(blogCategories, {
    fields: [blogPosts.categoryId],
    references: [blogCategories.id],
  }),
}))