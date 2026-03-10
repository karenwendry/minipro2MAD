import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, SafeAreaView, Platform, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { COLORS } from '../constants/Colors';

export default function AdminDashboardScreen() {
  const router = useRouter();
  
  // Panggil fungsi dari Convex
  const addBook = useMutation(api.books.addBook);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  const handleLogout = () => {
    router.replace('/');
  };

  const handleAddBook = async () => {
    if (!title || !author || !category || !synopsis) {
      Alert.alert("Oops!", "Judul, Penulis, Kategori, dan Sinopsis harus diisi.");
      return;
    }

    try {
      await addBook({
        title,
        author,
        category,
        synopsis,
        coverUrl: coverUrl !== '' ? coverUrl : undefined, // Jika kosong, set jadi undefined
        status: 'available',
      });
      
      Alert.alert("Sukses", "Buku berhasil ditambahkan ke perpustakaan!");
      
      // Kosongkan form kembali
      setTitle('');
      setAuthor('');
      setCategory('');
      setSynopsis('');
      setCoverUrl('');
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat menyimpan buku.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Panel Admin ⚙️</Text>
          <Text style={styles.subtitle}>Kelola inventaris perpustakaan</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.lightCream} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>Tambah Buku Baru</Text>
        
        <View style={styles.card}>
          
          {/* Tampilan Preview Gambar jika ada Link */}
          {coverUrl.length > 5 && (
            <View style={styles.previewContainer}>
              <Image 
                source={{ uri: coverUrl }} 
                style={styles.previewImage}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Link Cover Buku (Opsional)</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Paste link/URL gambar dari internet di sini"
              value={coverUrl}
              onChangeText={setCoverUrl}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Judul Buku</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Contoh: Pemrograman React Native"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Penulis</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Nama Penulis"
              value={author}
              onChangeText={setAuthor}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kategori</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Contoh: Teknologi, Fiksi, dll"
              value={category}
              onChangeText={setCategory}
            />
          </View>

          {/* Input Sinopsis (Multiline) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sinopsis / Detail Buku</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Tuliskan ringkasan isi buku..."
              value={synopsis}
              onChangeText={setSynopsis}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top" 
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleAddBook}>
            <Text style={styles.submitButtonText}>Simpan Buku</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.sandyAmber,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.lightCream,
    marginTop: 4,
    opacity: 0.9,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.silentNavy,
    marginBottom: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.blueCurrent,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 15,
    color: COLORS.black,
  },
  textArea: {
    height: 100,
    paddingTop: 15, // Agar teks multiline mulai dari atas
  },
  submitButton: {
    backgroundColor: COLORS.silentNavy,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.lightCream,
    fontWeight: 'bold',
    fontSize: 16,
  },
});