import {
  pgTable, text, integer, boolean, timestamp, uuid, pgEnum,
} from "drizzle-orm/pg-core"

export const affiliatePlatformEnum = pgEnum("affiliate_platform", [
  "shopee", "tokopedia", "tiktok_shop",
])

export const affiliateLinks = pgTable("affiliate_links", {
  id:           uuid("id").primaryKey().defaultRandom(),
  title:        text("title").notNull(),
  platform:     affiliatePlatformEnum("platform").notNull(),
  url:          text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  description:  text("description"),
  tags:         text("tags").array().default([]),
  clickCount:   integer("click_count").default(0),
  isActive:     boolean("is_active").default(true),
  createdAt:    timestamp("created_at").defaultNow(),
  updatedAt:    timestamp("updated_at").defaultNow(),
})