import { useLocalSearchParams, router } from 'expo-router';
import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  FlatList, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams();
  const bookId = id as Id<"books">;

  // 1. Mengambil data dari Convex
  const book = useQuery(api.books.getBookById, { id: bookId });
  const reviews = useQuery(api.reviews.getReviews, { bookId });
  
  // 2. Memanggil fungsi tambah review
  const submitReview = useMutation(api.reviews.addReview);

  // State untuk form input
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fungsi Kirim Review
  const handleAddReview = async () => {
    if (rating === 0) {
      Alert.alert('⚠️ Peringatan', 'Silakan pilih bintang (rating) terlebih dahulu!');
      return;
    }
    if (!comment.trim()) {
      Alert.alert('⚠️ Peringatan', 'Komentar ulasan tidak boleh kosong!');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        bookId,
        userName: 'Mahasiswa Unklab', // Ini nama default sementara
        rating: rating,
        comment: comment.trim(),
      });
      
      // Kosongkan form setelah sukses
      setRating(0);
      setComment('');
      Alert.alert('🎉 Berhasil', 'Terima kasih! Ulasan kamu berhasil ditambahkan.');
    } catch (error) {
      Alert.alert('❌ Error', 'Gagal mengirim ulasan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tampilan saat data sedang dimuat
  if (book === undefined) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#102a6b" />
        <Text style={styles.loadingText}>Memuat detail buku...</Text>
      </View>
    );
  }

  // Komponen Daftar Review
  const renderReviewItem = ({ item }: { item: any }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewerName}>👤 {item.userName}</Text>
        <Text style={styles.reviewStars}>
          {Array(item.rating).fill('⭐').join('')}
        </Text>
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        data={reviews || []}
        keyExtractor={(item) => item._id}
        renderItem={renderReviewItem}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          reviews === undefined ? (
            <ActivityIndicator color="#102a6b" style={{ marginTop: 20 }} />
          ) : (
            <Text style={styles.emptyReview}>Belum ada ulasan. Jadilah yang pertama mereview buku ini! ✨</Text>
          )
        }
        ListHeaderComponent={
          <>
            <TouchableOpacity style={styles.headerBack} onPress={() => router.back()}>
              <Text style={styles.headerBackText}>❮ Kembali</Text>
            </TouchableOpacity>

            <View style={styles.bookInfoCard}>
              <Text style={styles.bookTitle}>{book?.title}</Text>
              <Text style={styles.bookAuthor}>Penulis: {book?.author}</Text>
              {/* @ts-ignore */}
              {book?.description && <Text style={styles.bookDesc}>{book.description}</Text>}
            </View>

            <Text style={styles.sectionTitle}>Beri Ulasan & Rating</Text>
            <View style={styles.formCard}>
              <Text style={styles.label}>Pilih Rating:</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Text style={[styles.starIcon, rating >= star ? styles.starSelected : styles.starUnselected]}>
                      ★
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                style={styles.commentInput}
                placeholder="Tulis ulasan jujurmu di sini..."
                placeholderTextColor="#8aa6c1"
                multiline
                numberOfLines={3}
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity 
                style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
                onPress={handleAddReview}
                disabled={isSubmitting}
              >
                <Text style={styles.submitBtnText}>
                  {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Komentar Mahasiswa ({reviews?.length || 0})</Text>
          </>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faeed5', paddingHorizontal: 20 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#faeed5' },
  loadingText: { marginTop: 10, color: '#5990c0', fontWeight: 'bold' },
  headerBack: { marginTop: 20, marginBottom: 15, alignSelf: 'flex-start' },
  headerBackText: { fontSize: 16, color: '#102a6b', fontWeight: 'bold' },
  bookInfoCard: { backgroundColor: '#102a6b', padding: 20, borderRadius: 16, marginBottom: 25 },
  bookTitle: { fontSize: 22, fontWeight: '900', color: '#ffffff', marginBottom: 5 },
  bookAuthor: { fontSize: 14, color: '#8aa6c1', fontWeight: '600', marginBottom: 10 },
  bookDesc: { fontSize: 14, color: '#f8fafc', lineHeight: 22, marginTop: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#102a6b', marginBottom: 10, marginTop: 10 },
  formCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, marginBottom: 25, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#5990c0', marginBottom: 10 },
  starsContainer: { flexDirection: 'row', marginBottom: 15 },
  starIcon: { fontSize: 35, marginRight: 8 },
  starSelected: { color: '#f59e0b' }, 
  starUnselected: { color: '#e2e8f0' },
  commentInput: { backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, padding: 15, fontSize: 14, minHeight: 80, textAlignVertical: 'top', marginBottom: 15 },
  submitBtn: { backgroundColor: '#102a6b', padding: 14, borderRadius: 12, alignItems: 'center' },
  submitBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  reviewCard: { backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  reviewerName: { fontWeight: 'bold', color: '#102a6b', fontSize: 14 },
  reviewStars: { fontSize: 12, color: '#f59e0b' },
  reviewComment: { color: '#475569', fontSize: 14, lineHeight: 20 },
  emptyReview: { textAlign: 'center', color: '#8aa6c1', fontStyle: 'italic', marginTop: 10 },
});