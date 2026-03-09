import { Stack } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from "convex/react";

// Inisialisasi Convex menggunakan URL dari file .env
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL || "");

export default function Layout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="home"
          options={{ title: 'Home Perpustakaan' }}
        />
        {/* Tambahkan screen baru untuk halaman detail & review */}
        <Stack.Screen
          name="book/[id]"
          options={{ title: 'Detail & Review Buku' }}
        />
      </Stack>
    </ConvexProvider>
  );
}