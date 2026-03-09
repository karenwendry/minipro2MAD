import React, { useState } from 'react';
import { 
  View, Text, TextInput, FlatList, TouchableOpacity, 
  StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, Alert, Modal 
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

export default function HomeScreen() {
  // 1. Tangkap role dari halaman login
  const { role } = useLocalSearchParams();
  const isAdmin = role === 'Admin'; // Cek apakah yang login adalah Admin

  const [searchText, setSearchText] = useState('');
  
  // State untuk Modal Tambah Buku
  const [isModalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ambil data buku
  const books = useQuery(api.books.getBooks, { 
    searchTerm: searchText.length > 0 ? searchText : undefined 
  });

  // Panggil API Convex untuk Admin
  const createBookAPI = useMutation(api.books.createBook);
  const deleteBookAPI = useMutation(api.books.deleteBook);

  const handleLogout = () => {
    router.replace('/login');
  };

  // Fungsi Tambah Buku (Khusus Admin)
  const handleAddBook = async () => {
    if (!newTitle || !newAuthor) {
      Alert.alert("⚠️ Peringatan", "Judul dan Penulis wajib diisi!");
      return;
    }
    setIsSubmitting(true);
    try {
      await createBookAPI({ title: newTitle, author: newAuthor, description: newDesc });
      Alert.alert("🎉 Sukses", "Buku baru berhasil ditambahkan ke perpustakaan!");
      setModalVisible(false); // Tutup pop-up
      setNewTitle(''); setNewAuthor(''); setNewDesc(''); // Kosongkan form
    } catch (error) {
      Alert.alert("❌ Gagal", "Terjadi kesalahan saat menambah buku.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi Hapus Buku (Khusus Admin)
  const handleDeleteBook = (id: Id<"books">, title: string) => {
    Alert.alert(
      "🗑️ Hapus Buku",
      `Yakin ingin menghapus buku "${title}"? Semua ulasan mahasiswa di buku ini juga akan terhapus selamanya.`,
      [
        { text: "Batal", style: "cancel" },
        { 
          text: "Hapus", 
          style: "destructive", 
          onPress: async () => {
            try {
              await deleteBookAPI({ id });
              Alert.alert("Sukses", "Buku telah dihapus.");
            } catch (error) {
              Alert.alert("Gagal", "Tidak dapat menghapus buku.");
            }
          }
        }
      ]
    );
  };

  const renderBookCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: "/book/[id]",
        params: { id: item._id }
      })}
    >
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>✍️ {item.author}</Text>
      </View>
      <View style={styles.cardActionContainer}>
        <Text style={styles.actionText}>Detail & Review ➔</Text>
        
        {/* TOMBOL HAPUS (HANYA MUNCUL JIKA ADMIN) */}
        {isAdmin && (
          <TouchableOpacity 
            style={styles.deleteBtn}
            onPress={(e) => {
              e.stopPropagation(); // Mencegah klik card saat menekan tombol hapus
              handleDeleteBook(item._id, item.title);
            }}
          >
            <Text style={styles.deleteBtnText}>🗑️ Hapus</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#faeed5" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo {isAdmin ? 'Admin' : 'Mahasiswa'}! 👋</Text>
          <Text style={styles.title}>Katalog Buku</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Cari judul buku di sini..."
          placeholderTextColor="#8aa6c1"
          value={searchText}
          onChangeText={setSearchText}
        />
        
        {/* TOMBOL TAMBAH BUKU (HANYA MUNCUL JIKA ADMIN) */}
        {isAdmin && (
          <TouchableOpacity style={styles.addBookBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBookBtnText}>+ Tambah Buku</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.listContainer}>
        {books === undefined ? (
          <View style={styles.center}><ActivityIndicator size="large" color="#102a6b" /></View>
        ) : books.length === 0 ? (
          <View style={styles.center}><Text style={styles.emptyTitle}>Buku tidak ditemukan</Text></View>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item._id}
            renderItem={renderBookCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>

      {/* POP-UP MODAL TAMBAH BUKU */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📚 Tambah Buku Baru</Text>
            
            <Text style={styles.label}>Judul Buku</Text>
            <TextInput style={styles.modalInput} value={newTitle} onChangeText={setNewTitle} placeholder="Contoh: Laskar Pelangi" />
            
            <Text style={styles.label}>Penulis</Text>
            <TextInput style={styles.modalInput} value={newAuthor} onChangeText={setNewAuthor} placeholder="Contoh: Andrea Hirata" />
            
            <Text style={styles.label}>Deskripsi (Opsional)</Text>
            <TextInput style={[styles.modalInput, { height: 80, textAlignVertical: 'top' }]} value={newDesc} onChangeText={setNewDesc} multiline placeholder="Masukkan sinopsis buku..." />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAddBook} disabled={isSubmitting}>
                <Text style={styles.saveBtnText}>{isSubmitting ? "Menyimpan..." : "Simpan Buku"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faeed5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  greeting: { fontSize: 14, color: '#5990c0', fontWeight: '600', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '900', color: '#102a6b', letterSpacing: 0.5 },
  logoutBtn: { backgroundColor: '#fcd3d3', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  logoutText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 13 },
  searchContainer: { paddingHorizontal: 20, marginBottom: 15 },
  searchInput: { backgroundColor: '#ffffff', borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, fontSize: 15, color: '#1e293b' },
  addBookBtn: { backgroundColor: '#102a6b', marginTop: 10, paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  addBookBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  listContainer: { flex: 1, paddingHorizontal: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 16, overflow: 'hidden', elevation: 4 },
  cardContent: { padding: 20, borderLeftWidth: 5, borderLeftColor: '#102a6b' },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#102a6b', marginBottom: 8 },
  bookAuthor: { fontSize: 14, color: '#5990c0', fontWeight: '500' },
  cardActionContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', paddingVertical: 12, paddingHorizontal: 20 },
  actionText: { color: '#102a6b', fontWeight: 'bold', fontSize: 13 },
  deleteBtn: { backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  deleteBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#102a6b', marginBottom: 5 },
  
  // Gaya untuk Modal (Pop-up)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#ffffff', padding: 25, borderRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#102a6b', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#5990c0', marginBottom: 5 },
  modalInput: { borderWidth: 1.5, borderColor: '#e2e8f0', borderRadius: 12, padding: 12, marginBottom: 15, fontSize: 15, backgroundColor: '#f8fafc' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  cancelBtn: { flex: 1, backgroundColor: '#f1f5f9', padding: 15, borderRadius: 12, alignItems: 'center', marginRight: 10 },
  cancelBtnText: { color: '#64748b', fontWeight: 'bold' },
  saveBtn: { flex: 1, backgroundColor: '#102a6b', padding: 15, borderRadius: 12, alignItems: 'center', marginLeft: 10 },
  saveBtnText: { color: '#ffffff', fontWeight: 'bold' },
});