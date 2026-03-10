import { Stack } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';

// Inisialisasi klien Convex menggunakan URL dari file .env.local
// Tanda seru (!) memastikan bahwa TypeScript tahu variabel ini tidak null
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    // Membungkus seluruh aplikasi dengan ConvexProvider
    <ConvexProvider client={convex}>
      {/* Menggunakan Stack navigation bawaan expo-router */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Kamu bisa menambahkan konfigurasi spesifik per screen di sini jika perlu nantinya */}
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </ConvexProvider>
  );
}