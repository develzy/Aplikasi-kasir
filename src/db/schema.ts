import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const products = sqliteTable("products", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    category: text("category").notNull(),
    stock: integer("stock").notNull().default(0),
    status: text("status").notNull().default("Tersedia"),
});

export const transactions = sqliteTable("transactions", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    type: text("type").notNull(), // 'income' or 'expense'
    category: text("category").notNull(),
    amount: integer("amount").notNull(),
    date: text("date").notNull(),
    status: text("status").notNull().default("Selesai"),
    note: text("note"),
});

export const cartItems = sqliteTable("cart_items", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    productId: integer("product_id").references(() => products.id),
    quantity: integer("quantity").notNull(),
});

export const settings = sqliteTable("settings", {
    id: integer("id").primaryKey().default(1),
    storeName: text("store_name").notNull().default("KasUMKM"),
    address: text("address").notNull().default("Jl. Digital No. 123, Indonesia"),
    phone: text("phone").notNull().default("0812-3456-7890"),
    currency: text("currency").notNull().default("IDR"),
    logoUrl: text("logo_url"),
});

export const categories = sqliteTable("categories", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
});
