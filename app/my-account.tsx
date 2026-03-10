import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/Colors';

export default function MyAccountScreen() {
  const router = useRouter();
  // Ambil nama user yang dikirim dari Dashboard
  const { userName } = useLocalSearchParams<{ userName: string }>();
  const currentUserName = userName || 'Mahasiswa';

  // Ambil daftar buku wishlist dari database
  const wishlistBooks = useQuery(api.books.getMyWishlist, { userName: currentUserName });

  // Desain kartu untuk buku di wishlist
  const renderWishlistItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/book/${item._id}?currentUser=${currentUserName}` as any)}
      activeOpacity={0.7}
    >
      {item.coverUrl && item.coverUrl.length > 5 ? (
        <Image source={{ uri: item.coverUrl }} style={styles.bookCover} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderCover}>
          <Ionicons name="book" size={30} color={COLORS.sandyAmber} />
        </View>
      )}

      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookCategory}>{item.category}</Text>
        <View style={styles.wishlistBadge}>
          <Ionicons name="bookmark" size={14} color="#F59E0B" />
          <Text style={styles.wishlistBadgeText}>Tersimpan</Text>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={COLORS.gray} style={{ alignSelf: 'center' }} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Custom */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.lightCream} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Akun Saya</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Bagian Profil */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={COLORS.silentNavy} />
        </View>
        <Text style={styles.profileName}>{currentUserName}</Text>
        <Text style={styles.profileRole}>Mahasiswa Aktif</Text>
      </View>

      {/* Daftar Wishlist */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Buku Tersimpan (Wishlist)</Text>

        {wishlistBooks === undefined ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={COLORS.silentNavy} />
            <Text style={styles.emptyText}>Memuat wishlist...</Text>
          </View>
        ) : wishlistBooks.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="bookmark-outline" size={60} color={COLORS.gray} />
            <Text style={styles.emptyText}>Belum ada buku yang disimpan.</Text>
          </View>
        ) : (
          <FlatList
            data={wishlistBooks}
            keyExtractor={(item) => item._id}
            renderItem={renderWishlistItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightCream },
  header: {
    backgroundColor: COLORS.silentNavy,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: { color: COLORS.lightCream, fontSize: 18, fontWeight: 'bold' },
  profileSection: {
    alignItems: 'center',
    marginTop: -30, // Membuat avatar sedikit menimpa header
    marginBottom: 20,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.white,
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
    borderWidth: 3, borderColor: COLORS.sandyAmber
  },
  profileName: { fontSize: 20, fontWeight: 'bold', color: COLORS.silentNavy, marginTop: 10 },
  profileRole: { fontSize: 14, color: COLORS.gray, marginTop: 2 },
  content: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.silentNavy, marginBottom: 15 },
  listContainer: { paddingBottom: 30 },
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 15, padding: 12, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
  },
  bookCover: { width: 60, height: 85, borderRadius: 8, backgroundColor: '#F8F9FA' },
  placeholderCover: { width: 60, height: 85, backgroundColor: COLORS.silentNavy, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  bookInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  bookTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.silentNavy, marginBottom: 4 },
  bookAuthor: { fontSize: 13, color: COLORS.blueCurrent, marginBottom: 2 },
  bookCategory: { fontSize: 12, color: COLORS.gray, marginBottom: 6 },
  wishlistBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  wishlistBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#B45309', marginLeft: 4 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  emptyText: { marginTop: 15, color: COLORS.gray, fontSize: 15, fontStyle: 'italic' },
});