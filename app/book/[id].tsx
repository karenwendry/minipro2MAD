import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const bookId = id as Id<"books">;
  const router = useRouter();

  // State default untuk wishlist
  const [sessionUser] = useState('Mahasiswa'); 

  // --- STATE BARU UNTUK FORM ULASAN ---
  const [reviewName, setReviewName] = useState(''); // Untuk input nama reviewer
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data database secara realtime
  const book = useQuery(api.books.getBookById, { bookId });
  const reviews = useQuery(api.books.getReviews, { bookId });
  const isWishlisted = useQuery(api.books.checkWishlist, { bookId, userName: sessionUser });
  
  // Mutasi database
  const addReview = useMutation(api.books.addReview);
  const toggleWishlist = useMutation(api.books.toggleWishlist);

  // Hitung rata-rata rating
  const totalReviews = reviews?.length || 0;
  const averageRating = reviews && totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  // Fungsi Tambah/Hapus Wishlist
  const handleToggleWishlist = async () => {
    try {
      const added = await toggleWishlist({ bookId, userName: sessionUser });
      if (added) {
        Alert.alert("Tersimpan!", "Buku dimasukkan ke Wishlist kamu.");
      } else {
        Alert.alert("Dihapus", "Buku dikeluarkan dari Wishlist.");
      }
    } catch (error) {
      Alert.alert("Error", "Gagal menyimpan buku ke wishlist.");
    }
  };

  // Fungsi Kirim Ulasan
  const handleSubmitReview = async () => {
    // Validasi: Pastikan nama, bintang, dan komentar sudah diisi
    if (!reviewName.trim() || rating === 0 || !comment.trim()) {
      Alert.alert("Oops!", "Nama, Bintang, dan Komentar wajib diisi ya.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview({
        bookId,
        reviewerName: reviewName.trim(), // <-- Mengirim nama yang diketik manual
        rating,
        comment,
      });
      
      // Kosongkan form setelah sukses terkirim
      setReviewName('');
      setRating(0);
      setComment('');
      Alert.alert("Sukses", "Ulasanmu berhasil dikirim!");
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat mengirim ulasan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (book === undefined || reviews === undefined || isWishlisted === undefined) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={COLORS.silentNavy} />
      </View>
    );
  }

  if (book === null) {
    return (
      <View style={styles.centerContent}>
        <Text>Buku tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.lightCream} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detail Koleksi</Text>
        
        <TouchableOpacity onPress={handleToggleWishlist}>
          <Ionicons name={isWishlisted ? "bookmark" : "bookmark-outline"} size={24} color={COLORS.sandyAmber} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.topSection}>
          {book.coverUrl ? (
            <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
          ) : (
            <View style={styles.placeholderCover}>
              <Ionicons name="book" size={50} color={COLORS.sandyAmber} />
            </View>
          )}

          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingNumber}>{averageRating}</Text>
            </View>
          </View>

          <Text style={styles.author}>Oleh: {book.author}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{book.category}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopsis Buku</Text>
          <Text style={styles.synopsisText}>{book.synopsis}</Text>
        </View>

        {/* BOX TULIS ULASAN */}
        <View style={styles.section}>
          <View style={styles.reviewFormCard}>
            <Text style={styles.formTitle}>Berikan Penilaian</Text>
            
            {/* KODE BARU: Input Nama Reviewer */}
            <TextInput
              style={styles.nameInput}
              placeholder="Masukkan nama / inisialmu..."
              value={reviewName}
              onChangeText={setReviewName}
              placeholderTextColor={COLORS.gray}
            />
            
            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Ionicons name={rating >= s ? "star" : "star-outline"} size={32} color="#F59E0B" />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.commentInput}
              placeholder="Bagaimana menurutmu tentang buku ini?"
              multiline
              value={comment}
              onChangeText={setComment}
              placeholderTextColor={COLORS.gray}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReview} disabled={isSubmitting}>
              <Text style={styles.submitBtnText}>{isSubmitting ? "Mengirim..." : "Kirim Sekarang"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DAFTAR ULASAN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ulasan Pembaca ({totalReviews})</Text>
          {reviews.length === 0 ? (
            <Text style={{ color: COLORS.gray, fontStyle: 'italic' }}>Belum ada ulasan untuk buku ini.</Text>
          ) : (
            reviews.map((item) => (
              <View key={item._id} style={styles.reviewCard}>
                <View style={styles.reviewCardHeader}>
                  <Text style={styles.reviewerNameText}>{item.reviewerName}</Text>
                  <View style={styles.smallRating}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={styles.smallRatingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightCream },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: COLORS.silentNavy,
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: { color: COLORS.lightCream, fontSize: 18, fontWeight: 'bold' },
  topSection: { padding: 20, alignItems: 'center', backgroundColor: COLORS.white, borderBottomLeftRadius: 25, borderBottomRightRadius: 25, elevation: 3 },
  coverImage: { width: 130, height: 180, borderRadius: 12, marginBottom: 20 },
  placeholderCover: { width: 130, height: 180, borderRadius: 12, backgroundColor: COLORS.silentNavy, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: COLORS.silentNavy, flexShrink: 1, textAlign: 'center' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginLeft: 10, borderWidth: 1, borderColor: '#F59E0B' },
  ratingNumber: { marginLeft: 4, fontWeight: 'bold', color: '#B45309', fontSize: 14 },
  author: { fontSize: 15, color: COLORS.blueCurrent, marginTop: 8 },
  categoryTag: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 15, marginTop: 10 },
  categoryText: { fontSize: 12, color: COLORS.gray, fontWeight: '600' },
  section: { paddingHorizontal: 20, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.silentNavy, marginBottom: 12 },
  synopsisText: { fontSize: 15, color: '#444', lineHeight: 24, textAlign: 'justify' },
  
  reviewFormCard: { backgroundColor: COLORS.white, padding: 18, borderRadius: 15, elevation: 2 },
  formTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.silentNavy, marginBottom: 15 },
  
  // Style Baru untuk Kolom Nama
  nameInput: { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#EEE', marginBottom: 15, fontSize: 14, color: COLORS.black },
  
  starPicker: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20 },
  commentInput: { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, height: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#EEE', color: COLORS.black },
  submitBtn: { backgroundColor: COLORS.sandyAmber, padding: 15, borderRadius: 12, alignItems: 'center', marginTop: 15 },
  submitBtnText: { color: COLORS.silentNavy, fontWeight: 'bold', fontSize: 15 },
  
  reviewCard: { backgroundColor: COLORS.white, padding: 15, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.sandyAmber },
  reviewCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  reviewerNameText: { fontWeight: 'bold', color: COLORS.silentNavy },
  smallRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFBEB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  smallRatingText: { fontSize: 11, fontWeight: 'bold', marginLeft: 3, color: '#B45309' },
  commentText: { color: '#555', fontSize: 14, lineHeight: 20 }
});