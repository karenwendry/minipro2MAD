import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { COLORS } from '../constants/Colors';

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'student' | 'admin' }>();
  
  // Memanggil fungsi register dari Convex
  const registerUser = useMutation(api.users.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    // 1. Validasi jika ada kolom yang kosong
    if (!name || !email || !password) {
      Alert.alert("Oops!", "Semua kolom (Nama, Email, dan Password) harus diisi.");
      return;
    }

    // 2. Validasi email khusus mahasiswa di sisi frontend
    if (role === 'student' && !email.endsWith('@student.unklab.ac.id')) {
      Alert.alert("Pendaftaran Ditolak", "Mahasiswa wajib menggunakan email yang berakhiran @student.unklab.ac.id");
      return;
    }

    try {
      // 3. Mengirim data ke database Convex
      await registerUser({ 
        name, 
        email, 
        password, 
        role: role as 'student' | 'admin' 
      });
      
      Alert.alert("Berhasil!", "Akun kamu berhasil dibuat. Silakan login.");
      router.back(); // Otomatis kembali ke halaman login jika sukses
    } catch (error: any) {
      Alert.alert("Gagal Mendaftar", error.message || "Terjadi kesalahan pada server.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Header */}
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.lightCream} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buat Akun</Text>
        <Text style={styles.headerSubtitle}>Daftar sebagai {role === 'admin' ? 'Administrator' : 'Mahasiswa'} baru</Text>
      </View>

      {/* Floating Card Form */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
          <View style={styles.card}>
            
            {/* Input Nama */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nama Lengkap</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color={COLORS.lightBlue} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={COLORS.gray}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Input Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={20} color={COLORS.lightBlue} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder={role === 'student' ? "nama@student.unklab.ac.id" : "nama@email.com"}
                  placeholderTextColor={COLORS.gray}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Input Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color={COLORS.lightBlue} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input} 
                  placeholder="Buat password yang kuat"
                  placeholderTextColor={COLORS.gray}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.gray} />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister} activeOpacity={0.8}>
              <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Sudah punya akun? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.linkText}>Masuk di sini</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightCream,
  },
  headerBackground: {
    backgroundColor: COLORS.silentNavy,
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.sandyAmber,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightCream,
    marginTop: 5,
    opacity: 0.8,
  },
  formContainer: {
    flex: 1,
    marginTop: -50, 
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.blueCurrent,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: COLORS.black,
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: COLORS.sandyAmber, // Warna pembeda untuk daftar
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: COLORS.sandyAmber,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  registerButtonText: {
    color: COLORS.silentNavy,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  footerText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.blueCurrent,
    fontWeight: 'bold',
    fontSize: 14,
  },
});