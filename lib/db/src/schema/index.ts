import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const bawabaUsers = pgTable(
  "bawaba_users",
  {
    id: serial("id").primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    email: text("email").notNull(),
    fullName: text("full_name").notNull(),
    phone: text("phone"),
    role: text("role").default("customer").notNull(),
    isDemo: boolean("is_demo").default(false).notNull(),
    ...timestamps,
  },
  (table) => ({
    clerkUserIdIndex: uniqueIndex("bawaba_users_clerk_user_id_idx").on(table.clerkUserId),
    emailIndex: uniqueIndex("bawaba_users_email_idx").on(table.email),
  }),
);

export const bawabaProperties = pgTable("bawaba_properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  propertyType: text("property_type").notNull(),
  listingType: text("listing_type").notNull(),
  price: integer("price").notNull(),
  area: integer("area").notNull(),
  rooms: integer("rooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  governorate: text("governorate").notNull(),
  district: text("district").notNull(),
  finish: text("finish").notNull(),
  image: text("image").notNull(),
  description: text("description"),
  featured: boolean("featured").default(false).notNull(),
  status: text("status").default("Pending Review").notNull(),
  views: integer("views").default(0).notNull(),
  amenities: jsonb("amenities").$type<string[]>().default([]).notNull(),
  ownerClerkUserId: text("owner_clerk_user_id"),
  isDemo: boolean("is_demo").default(false).notNull(),
  ...timestamps,
});

export const bawabaViewingRequests = pgTable("bawaba_viewing_requests", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  clerkUserId: text("clerk_user_id"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  preferredDate: text("preferred_date"),
  note: text("note"),
  status: text("status").default("Pending").notNull(),
  isDemo: boolean("is_demo").default(false).notNull(),
  ...timestamps,
});

export const bawabaFinishingServices = pgTable("bawaba_finishing_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  unit: text("unit").notNull(),
  laborPrice: integer("labor_price").notNull(),
  accent: text("accent").notNull(),
  isDemo: boolean("is_demo").default(false).notNull(),
  ...timestamps,
});

export const bawabaProfessionals = pgTable("bawaba_professionals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  specialty: text("specialty").notNull(),
  governorate: text("governorate").notNull(),
  district: text("district").notNull(),
  experience: integer("experience").notNull(),
  rating: integer("rating").notNull(),
  image: text("image"),
  available: boolean("available").default(true).notNull(),
  bio: text("bio"),
  isDemo: boolean("is_demo").default(false).notNull(),
  ...timestamps,
});

export const bawabaProducts = pgTable("bawaba_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  vendor: text("vendor").notNull(),
  price: integer("price").notNull(),
  oldPrice: integer("old_price").notNull(),
  image: text("image").notNull(),
  stock: integer("stock").default(0).notNull(),
  badge: text("badge"),
  description: text("description"),
  isDemo: boolean("is_demo").default(false).notNull(),
  ...timestamps,
});

export const bawabaOrders = pgTable("bawaba_orders", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id"),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  items: jsonb("items").$type<Array<{ productId: number; quantity: number }>>().notNull(),
  total: integer("total").notNull(),
  status: text("status").default("Pending").notNull(),
  isDemo: boolean("is_demo").default(false).notNull(),
  ...timestamps,
});

export const bawabaAppointments = pgTable("bawaba_appointments", {
  id: serial("id").primaryKey(),
  professionalId: integer("professional_id").notNull(),
  clerkUserId: text("clerk_user_id"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  preferredDate: text("preferred_date"),
  note: text("note"),
  status: text("status").default("Pending").notNull(),
  isDemo: boolean("is_demo").default(false).notNull(),
  ...timestamps,
});

export type BawabaUser = typeof bawabaUsers.$inferSelect;
export type BawabaProperty = typeof bawabaProperties.$inferSelect;