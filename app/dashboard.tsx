import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar, Image, ScrollView, Animated } from 'react-native'; 
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { COLORS } from '../constants/Colors';

// --- DAFTAR KATEGORI ---
const CATEGORIES = ['Semua', 'Teknologi', 'Fiksi', 'Sains', 'Agama', 'Bisnis', 'Sastra'];

// --- KOMPONEN KARTU BUKU INDIVIDUAL ---
const BookCard = ({ item }: { item: any }) => {
  const router = useRouter();
  
  const reviews = useQuery(api.books.getReviews, { bookId: item._id });
  
  const totalReviews = reviews?.length || 0;
  const averageRating = reviews && totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/book/${item._id}` as any)}
      activeOpacity={0.7}
    >
      {item.coverUrl && item.coverUrl.length > 5 ? (
        <Image source={{ uri: item.coverUrl }} style={styles.bookCover} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderCover}>
          <Ionicons name="book" size={40} color={COLORS.sandyAmber} />
        </View>
      )}

      <View style={styles.bookInfo}>
        <View style={styles.titleRow}>
          <View style={styles.titleWrapper}>
            <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
          </View>
          
          {totalReviews > 0 && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingNumber}>{averageRating}</Text>
            </View>
          )}
        </View>

        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookCategory}>{item.category}</Text>
        
        {item.synopsis && (
          <Text style={styles.bookSynopsis} numberOfLines={2}>
            {item.synopsis}
          </Text>
        )}

        <View style={[styles.statusBadge, item.status === 'borrowed' ? styles.statusBorrowed : styles.statusAvailable]}>
          <Text style={[styles.statusText, item.status === 'borrowed' ? styles.textBorrowed : styles.textAvailable]}>
            {item.status === 'available' ? 'Tersedia' : 'Dipinjam'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- KOMPONEN SKELETON LOADING ---
const SkeletonCard = () => {
  const fadeAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.3, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
      <View style={[styles.bookCover, { backgroundColor: '#E5E7EB' }]} />
      <View style={styles.bookInfo}>
        <View style={{ height: 16, backgroundColor: '#E5E7EB', borderRadius: 4, width: '80%', marginBottom: 10 }} />
        <View style={{ height: 12, backgroundColor: '#E5E7EB', borderRadius: 4, width: '50%', marginBottom: 8 }} />
        <View style={{ height: 12, backgroundColor: '#E5E7EB', borderRadius: 4, width: '40%', marginBottom: 15 }} />
        <View style={{ height: 20, backgroundColor: '#E5E7EB', borderRadius: 6, width: '30%' }} />
      </View>
    </Animated.View>
  );
};

// --- HALAMAN UTAMA DASHBOARD ---
export default function DashboardScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Mengambil data buku dari database Convex
  const books = useQuery(api.books.getBooks, { searchQuery });
  
  // Mengambil data leaderboard (Top Reviewers)
  const topReviewers = useQuery(api.books.getTopReviewers);

  // Logika untuk menyaring buku berdasarkan kategori yang diklik
  const filteredBooks = books?.filter(book => {
    if (selectedCategory === 'Semua') return true;
    return book.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleLogout = () => {
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Halo, Mahasiswa! 👋</Text>
            <Text style={styles.subtitle}>Mau baca buku apa hari ini?</Text>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity 
              onPress={() => router.push({ pathname: '/my-account', params: { userName: 'Mahasiswa' } })} 
              style={styles.headerButton}
            >
              <Ionicons name="person-outline" size={24} color={COLORS.lightCream} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.lightCream} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari judul buku..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* LEADERBOARD SECTION (Gamifikasi) */}
      <View style={styles.leaderboardContainer}>
        <Text style={styles.sectionTitle}>🏆 Top Pembaca Aktif</Text>
        
        {topReviewers === undefined ? (
          <Text style={styles.loadingText}>Menghitung klasemen...</Text>
        ) : topReviewers.length === 0 ? (
          <Text style={styles.emptyText}>Belum ada data ulasan.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 5 }}>
            {topReviewers.map((user, index) => (
              <View key={index} style={styles.leaderboardCard}>
                <Text style={styles.medal}>{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</Text>
                <View>
                  <Text style={styles.leaderboardName} numberOfLines={1}>{user.name}</Text>
                  <Text style={styles.leaderboardCount}>{user.count} Ulasan</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* FILTER KATEGORI (PILL BUTTONS) */}
      <View style={styles.categoryContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryPill,
                selectedCategory === cat && styles.categoryPillActive
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[
                styles.categoryPillText,
                selectedCategory === cat && styles.categoryPillTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Daftar Buku */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'Semua' ? 'Koleksi Perpustakaan' : `Kategori: ${selectedCategory}`}
        </Text>
        
        {filteredBooks === undefined ? (
          // JIKA SEDANG LOADING: Tampilkan 4 Skeleton Card
          <FlatList
            data={[1, 2, 3, 4]} 
            keyExtractor={(item) => item.toString()}
            renderItem={() => <SkeletonCard />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : filteredBooks.length === 0 ? (
          // JIKA BUKU KOSONG: Tampilkan pesan
          <View style={styles.centerContent}>
            <Ionicons name="library-outline" size={60} color={COLORS.gray} />
            <Text style={styles.emptyText}>Buku tidak ditemukan</Text>
          </View>
        ) : (
          // JIKA BUKU ADA: Tampilkan daftar buku asli
          <FlatList
            data={filteredBooks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <BookCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightCream,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: COLORS.silentNavy,
    padding: 20,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 10,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.sandyAmber },
  subtitle: { fontSize: 14, color: COLORS.lightCream, marginTop: 4, opacity: 0.9 },
  headerButton: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 15, paddingHorizontal: 15, height: 50 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.black },
  
  // STYLE UNTUK LEADERBOARD
  leaderboardContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  leaderboardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 140,
    maxWidth: 180,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  medal: { fontSize: 24, marginRight: 8 },
  leaderboardName: { fontSize: 13, fontWeight: 'bold', color: COLORS.silentNavy },
  leaderboardCount: { fontSize: 11, color: COLORS.gray, marginTop: 2 },

  // STYLE UNTUK KATEGORI
  categoryContainer: {
    marginTop: 15,
    marginBottom: 5,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  categoryPillActive: {
    backgroundColor: COLORS.sandyAmber,
    borderColor: COLORS.sandyAmber,
  },
  categoryPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
  },
  categoryPillTextActive: {
    color: COLORS.silentNavy,
    fontWeight: 'bold',
  },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.silentNavy, marginBottom: 10 },
  listContainer: { paddingBottom: 20 },
  
  card: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: 15, padding: 15, marginBottom: 15,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4,
  },
  bookCover: { width: 80, height: 110, borderRadius: 10, backgroundColor: '#F8F9FA' },
  placeholderCover: { width: 80, height: 110, backgroundColor: COLORS.silentNavy, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  
  bookInfo: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 },
  titleWrapper: { flex: 1, marginRight: 8 }, 
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.silentNavy },
  
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', 
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#F59E0B'
  },
  ratingNumber: { fontSize: 12, fontWeight: 'bold', color: '#B45309', marginLeft: 4 },
  
  bookAuthor: { fontSize: 13, color: COLORS.blueCurrent, marginBottom: 2 },
  bookCategory: { fontSize: 12, color: COLORS.gray, marginBottom: 6 },
  bookSynopsis: { fontSize: 12, color: '#666', fontStyle: 'italic', marginBottom: 8 },
  
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
  statusAvailable: { backgroundColor: '#D1FAE5' },
  statusBorrowed: { backgroundColor: '#FEE2E2' },
  statusText: { fontSize: 11, fontWeight: 'bold' },
  textAvailable: { color: '#059669' },
  textBorrowed: { color: '#DC2626' },
  
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { marginTop: 10, color: COLORS.gray, fontSize: 14 },
  emptyText: { marginTop: 10, color: COLORS.gray, fontSize: 14 },
});