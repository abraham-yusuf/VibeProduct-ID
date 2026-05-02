import {
  pgTable, text, integer, boolean, timestamp, uuid, pgEnum,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const platformEnum = pgEnum("platform", [
  "instagram", "tiktok", "youtube", "twitter", "facebook", "telegram", "spotify",
])

export const orderStatusEnum = pgEnum("order_status", [
  "pending", "paid", "processing", "completed", "failed", "cancelled", "refunded",
])

// Tables
export const smmCategories = pgTable("smm_categories", {
  id:        uuid("id").primaryKey().defaultRandom(),
  name:      text("name").notNull(),
  platform:  platformEnum("platform").notNull(),
  icon:      text("icon"),                          // emoji atau nama lucide icon
  sortOrder: integer("sort_order").default(0),
  isActive:  boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
})

export const smmPackages = pgTable("smm_packages", {
  id:          uuid("id").primaryKey().defaultRandom(),
  categoryId:  uuid("category_id").notNull().references(() => smmCategories.id, { onDelete: "cascade" }),
  name:        text("name").notNull(),
  description: text("description"),
  price:       integer("price").notNull(),           // dalam rupiah
  minQty:      integer("min_qty").default(100),
  maxQty:      integer("max_qty").default(100000),
  sortOrder:   integer("sort_order").default(0),
  isActive:    boolean("is_active").default(true),
  createdAt:   timestamp("created_at").defaultNow(),
  updatedAt:   timestamp("updated_at").defaultNow(),
})

export const smmOrders = pgTable("smm_orders", {
  id:             uuid("id").primaryKey().defaultRandom(),
  packageId:      uuid("package_id").notNull().references(() => smmPackages.id),
  buyerName:      text("buyer_name").notNull(),
  buyerEmail:     text("buyer_email").notNull(),
  buyerPhone:     text("buyer_phone").notNull(),
  targetUrl:      text("target_url").notNull(),
  quantity:       integer("quantity").notNull(),
  totalPrice:     integer("total_price").notNull(),
  status:         orderStatusEnum("status").default("pending"),
  paymentId:      text("payment_id"),               // Midtrans order_id
  snapToken:      text("snap_token"),               // Midtrans snap token
  notes:          text("notes"),
  adminNotes:     text("admin_notes"),
  createdAt:      timestamp("created_at").defaultNow(),
  updatedAt:      timestamp("updated_at").defaultNow(),
  paidAt:         timestamp("paid_at"),
  completedAt:    timestamp("completed_at"),
})

// Relations
export const smmCategoriesRelations = relations(smmCategories, ({ many }) => ({
  packages: many(smmPackages),
}))

export const smmPackagesRelations = relations(smmPackages, ({ one, many }) => ({
  category: one(smmCategories, {
    fields: [smmPackages.categoryId],
    references: [smmCategories.id],
  }),
  orders: many(smmOrders),
}))

export const smmOrdersRelations = relations(smmOrders, ({ one }) => ({
  package: one(smmPackages, {
    fields: [smmOrders.packageId],
    references: [smmPackages.id],
  }),
}))