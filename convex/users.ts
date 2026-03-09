import { mutation } from "./_generated/server";
import { v } from "convex/values";

// API untuk Mendaftar (Register)
export const register = mutation({
  args: { 
    nim: v.string(), 
    password: v.string(), 
    role: v.string(),
    fullName: v.string()
  },
  handler: async (ctx, args) => {
    // 1. Cek apakah NIM sudah pernah didaftarkan menggunakan .filter()
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("nim"), args.nim))
      .first();

    if (existingUser) {
      throw new Error(`Akun dengan ID ${args.nim} sudah terdaftar!`);
    }

    // 2. Jika belum, simpan pengguna baru ke Database
    await ctx.db.insert("users", {
      nim: args.nim,
      password: args.password,
      role: args.role,
      fullName: args.fullName,
    });
  },
});

// API untuk Masuk (Login)
export const login = mutation({
  args: { 
    nim: v.string(), 
    password: v.string(), 
    role: v.string() 
  },
  handler: async (ctx, args) => {
    // 1. Cari pengguna berdasarkan NIM menggunakan .filter()
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("nim"), args.nim))
      .first();

    // 2. Validasi Akun
    if (!user) {
      throw new Error("Akun tidak ditemukan! Silakan daftar terlebih dahulu.");
    }
    if (user.password !== args.password) {
      throw new Error("Password yang kamu masukkan salah!");
    }
    if (user.role !== args.role) {
      throw new Error(`Akses ditolak! Akun ini bukan terdaftar sebagai ${args.role}.`);
    }

    // 3. Login sukses (Jangan kembalikan password demi keamanan)
    return {
      _id: user._id,
      nim: user.nim,
      fullName: user.fullName,
      role: user.role,
    }; 
  },
});