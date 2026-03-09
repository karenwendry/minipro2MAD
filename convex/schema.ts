import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  books: defineTable({
    title: v.string(),
    author: v.string(),
    description: v.optional(v.string()),
    isRecommended: v.optional(v.boolean()),
  }).searchIndex("search_title", { searchField: "title" }),
  
  reviews: defineTable({
    bookId: v.id("books"),
    userName: v.string(),
    rating: v.number(),
    comment: v.string(),
  }),

  users: defineTable({
    nim: v.string(),
    password: v.string(),
    role: v.string(), // 'Admin' atau 'Student'
  }),
});