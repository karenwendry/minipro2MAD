import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// --- FUNGSI DASAR BUKU ---

// Fungsi mengambil daftar buku
export const getBooks = query({
  args: { searchQuery: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.searchQuery) {
      return await ctx.db
        .query("books")
        .withSearchIndex("search_title", (q) =>
          q.search("title", args.searchQuery as string)
        )
        .collect();
    }
    return await ctx.db.query("books").order("desc").collect();
  },
});

// Fungsi menambah buku
export const addBook = mutation({
  args: {
    title: v.string(),
    author: v.string(),
    category: v.string(),
    synopsis: v.string(),
    coverUrl: v.optional(v.string()), // Menerima teks berupa link gambar
    status: v.union(v.literal("available"), v.literal("borrowed")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("books", {
      title: args.title,
      author: args.author,
      category: args.category,
      synopsis: args.synopsis,
      coverUrl: args.coverUrl,
      status: args.status,
    });
  },
});

// Fungsi untuk mengambil detail 1 buku saja berdasarkan ID
export const getBookById = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.bookId);
  },
});


// --- LOGIKA ULASAN (REVIEWS) ---

// Fungsi untuk mengambil semua review untuk satu buku
export const getReviews = query({
  args: { bookId: v.id("books") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_book", (q) => q.eq("bookId", args.bookId))
      .order("desc") // Review terbaru di atas
      .collect();
  },
});

// Fungsi untuk mahasiswa menambahkan review baru
export const addReview = mutation({
  args: {
    bookId: v.id("books"),
    reviewerName: v.string(),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reviews", {
      bookId: args.bookId,
      reviewerName: args.reviewerName,
      rating: args.rating,
      comment: args.comment,
    });
  },
});


// --- LOGIKA WISHLIST (SIMPAN BUKU) ---

// 1. Cek apakah buku ini sudah ada di wishlist mahasiswa tersebut
export const checkWishlist = query({
  args: { bookId: v.id("books"), userName: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wishlists")
      .withIndex("by_user_book", (q) => q.eq("userName", args.userName).eq("bookId", args.bookId))
      .first();
    return !!existing; // Mengembalikan true jika sudah disimpan
  },
});

// 2. Tambah / Hapus buku dari wishlist (Toggle)
export const toggleWishlist = mutation({
  args: { bookId: v.id("books"), userName: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("wishlists")
      .withIndex("by_user_book", (q) => q.eq("userName", args.userName).eq("bookId", args.bookId))
      .first();
      
    if (existing) {
      await ctx.db.delete(existing._id);
      return false; // Buku dihapus dari wishlist
    } else {
      await ctx.db.insert("wishlists", { bookId: args.bookId, userName: args.userName });
      return true; // Buku ditambahkan ke wishlist
    }
  },
});

// 3. Ambil SEMUA buku yang ada di wishlist milik satu mahasiswa
export const getMyWishlist = query({
  args: { userName: v.string() },
  handler: async (ctx, args) => {
    const wishlists = await ctx.db
      .query("wishlists")
      .withIndex("by_user", (q) => q.eq("userName", args.userName))
      .collect();
      
    // Mencari detail buku untuk setiap ID yang disimpan
    const savedBooks = [];
    for (const item of wishlists) {
      const book = await ctx.db.get(item.bookId);
      if (book) savedBooks.push(book);
    }
    return savedBooks;
  },
});


// --- LOGIKA LEADERBOARD (GAMIFIKASI) ---

// Mengambil Top 3 mahasiswa yang paling banyak menulis review
export const getTopReviewers = query({
  args: {},
  handler: async (ctx) => {
    // Ambil semua data dari tabel reviews
    const reviews = await ctx.db.query("reviews").collect();
    
    // Hitung jumlah ulasan per user
    const userCounts: Record<string, number> = {};
    for (const review of reviews) {
      // Menggunakan reviewerName sesuai dengan schema saat menambah ulasan
      const name = review.reviewerName || "Mahasiswa Anonim";
      userCounts[name] = (userCounts[name] || 0) + 1;
    }
    
    // Ubah ke array, urutkan dari yang terbanyak, dan ambil 3 teratas
    const sortedLeaderboard = Object.entries(userCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
      
    return sortedLeaderboard;
  },
});