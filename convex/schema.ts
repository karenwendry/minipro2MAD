import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("student"), v.literal("admin")),
  }).index("by_email", ["email"]),

  books: defineTable({
    title: v.string(),
    author: v.string(),
    category: v.string(),
    synopsis: v.string(),
    coverUrl: v.optional(v.string()),
    status: v.union(v.literal("available"), v.literal("borrowed")),
  }).searchIndex("search_title", {
    searchField: "title",
  }),

  reviews: defineTable({
    bookId: v.id("books"),
    reviewerName: v.string(),
    rating: v.number(),
    comment: v.string(),
  }).index("by_book", ["bookId"]),

  // TABEL BARU: Menyimpan daftar buku favorit mahasiswa
  wishlists: defineTable({
    userName: v.string(),
    bookId: v.id("books"),
  }).index("by_user", ["userName"])
    .index("by_user_book", ["userName", "bookId"]),
});