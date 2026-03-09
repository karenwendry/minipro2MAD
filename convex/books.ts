import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBooks = query({
  args: { searchTerm: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.searchTerm) {
      return await ctx.db
        .query("books")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.searchTerm as string)
        )
        .collect();
    }
    return await ctx.db.query("books").collect();
  },
});

export const getBookById = query({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

// ==========================================
// FITUR KHUSUS ADMIN (TAMBAH & HAPUS BUKU)
// ==========================================

// Menambah Buku Baru
export const createBook = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("books", {
      title: args.title,
      author: args.author,
      description: args.description,
    });
  },
});

// Menghapus Buku (Dan otomatis menghapus ulasannya juga)
export const deleteBook = mutation({
  args: { id: v.id("books") },
  handler: async (ctx, args) => {
    // 1. Cari dan hapus semua ulasan yang terkait dengan buku ini
    const reviews = await ctx.db
      .query("reviews")
      .filter((q) => q.eq(q.field("bookId"), args.id))
      .collect();
      
    for (const review of reviews) {
      await ctx.db.delete(review._id);
    }

    // 2. Hapus buku utamanya
    await ctx.db.delete(args.id);
  },
});