import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useConvex } from 'convex/react';
import { api } from '../convex/_generated/api';
import { COLORS } from '../constants/Colors';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'student' | 'admin' }>();
  
  // Inisialisasi klien Convex untuk melakukan query
  const convex = useConvex();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // 1. Validasi input kosong
    if (!email || !password) {
      Alert.alert("Oops!", "Email dan Password tidak boleh kosong.");
      return;
    }

    // 2. Validasi khusus email mahasiswa
    if (role === 'student' && !email.endsWith('@student.unklab.ac.id')) {
      Alert.alert("Akses Ditolak", "Mahasiswa wajib menggunakan email @student.unklab.ac.id");
      return;
    }

    try {
      // 3. Panggil query login ke database Convex
      const user = await convex.query(api.users.login, { 
        email, 
        password, 
        role: role as 'student' | 'admin' 
      });

      // 4. Jika berhasil melewati pengecekan di Convex
      Alert.alert("Sukses", `Selamat datang kembali, ${user.name}!`);
      
      // Redirect ke dashboard yang sesuai (sudah di-uncomment!)
      router.replace(role === 'admin' ? '/admin-dashboard' : '/dashboard');

    } catch (error: any) {
      // Menangkap pesan error dari backend (misal: akun tidak ada, password salah)
      Alert.alert("Gagal Login", error.message || "Terjadi kesalahan pada server.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Header */}
      <View style={styles.headerBackground}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.lightCream} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Selamat Datang</Text>
        <Text style={styles.headerSubtitle}>Masuk ke portal {role === 'admin' ? 'Administrator' : 'Mahasiswa'}</Text>
      </View>

      {/* Floating Card Form */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.formContainer}>
        <View style={styles.card}>
          
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.lightBlue} style={styles.inputIcon} />
              <TextInput 
                style={styles.input} 
                placeholder="••••••••"
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

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>Masuk Sekarang</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/register', params: { role } })}>
              <Text style={styles.linkText}>Daftar di sini</Text>
            </TouchableOpacity>
          </View>

        </View>
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
    marginTop: -50, // This makes the card overlap the header
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
  loginButton: {
    backgroundColor: COLORS.silentNavy,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
    shadowColor: COLORS.silentNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: COLORS.lightCream,
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
    color: COLORS.sandyAmber,
    fontWeight: 'bold',
    fontSize: 14,
  },
});