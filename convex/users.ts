import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("student"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    // Validasi Domain Email Mahasiswa
    if (args.role === "student" && !args.email.endsWith("@student.unklab.ac.id")) {
      throw new Error("Mahasiswa wajib menggunakan email @student.unklab.ac.id!");
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("Email sudah terdaftar! Silakan langsung login.");
    }

    // Insert user baru
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: args.role,
    });

    return userId;
  },
});

export const login = query({
  args: {
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal("student"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    // Validasi Domain Email Mahasiswa saat login
    if (args.role === "student" && !args.email.endsWith("@student.unklab.ac.id")) {
      throw new Error("Gunakan email @student.unklab.ac.id untuk login mahasiswa!");
    }

    // Cari user di database
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    // Validasi akun dan password
    if (!user) throw new Error("Akun tidak ditemukan! Silakan daftar terlebih dahulu.");
    if (user.password !== args.password) throw new Error("Password yang kamu masukkan salah!");
    if (user.role !== args.role) throw new Error(`Akun ini tidak terdaftar sebagai ${args.role}!`);

    return user; // Berhasil login
  },
});