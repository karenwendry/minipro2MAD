import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// API untuk Mengambil semua review dari 1 buku tertentu
export const getReviews = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .filter((q) => q.eq(q.field("bookId"), args.bookId))
      .collect();
  },
});

// API untuk Menambahkan Review Baru
export const addReview = mutation({
  args: {
    bookId: v.id("books"),
    userName: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reviews", {
      bookId: args.bookId,
      userName: args.userName,
      rating: args.rating,
      comment: args.comment,
    });
  },
});