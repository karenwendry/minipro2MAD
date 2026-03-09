import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
  // State untuk menentukan tipe login: 'mahasiswa' atau 'admin'
  const [loginType, setLoginType] = useState<'mahasiswa' | 'admin'>('mahasiswa');
  
  // State form
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Harap isi semua kolom!');
      return;
    }

    // Logika login bisa disesuaikan nanti (misal memanggil API)
    Alert.alert(
      'Login Berhasil', 
      `Masuk sebagai: ${loginType.toUpperCase()}\nID/NIM: ${identifier}`
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.cardContainer}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Sistem Perpustakaan</Text>
          <Text style={styles.subtitle}>Silakan masuk ke akun Anda</Text>
        </View>

        {/* Tab Switcher: Mahasiswa vs Admin */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, loginType === 'mahasiswa' && styles.tabActive]}
            onPress={() => setLoginType('mahasiswa')}
          >
            <Text style={[styles.tabText, loginType === 'mahasiswa' && styles.tabTextActive]}>
              Mahasiswa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabButton, loginType === 'admin' && styles.tabActive]}
            onPress={() => setLoginType('admin')}
          >
            <Text style={[styles.tabText, loginType === 'admin' && styles.tabTextActive]}>
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>
            {loginType === 'mahasiswa' ? 'NIM / Akun Kampus' : 'ID Admin / Username'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={loginType === 'mahasiswa' ? "Masukkan NIM" : "Masukkan ID Admin"}
            placeholderTextColor="#5990c0"
            value={identifier}
            onChangeText={setIdentifier}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Kata Sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan kata sandi"
            placeholderTextColor="#5990c0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Masuk ke Sistem</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>🔒 Autentikasi Aman & Terenkripsi</Text>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}

// === STYLESHEET MEMAKAI COLOR PALETTE ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcedd3', // Light Cream
    justifyContent: 'center',
    padding: 20,
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#102a6b',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    borderTopWidth: 6,
    borderTopColor: '#cea273', // Sandy Amber
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#102a6b', // Silent Navy
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#015185', // Blue Current
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#5990c0', // Light Blue (Inactive Tab Background)
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#102a6b', // Silent Navy (Active Tab Background)
  },
  tabText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  tabTextActive: {
    color: '#fcedd3', // Light Cream Text on Active Tab
  },
  formContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#102a6b',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#5990c0',
    backgroundColor: '#f9fbfc',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#102a6b',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#102a6b', // Silent Navy
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 5,
  },
  loginButtonText: {
    color: '#fcedd3', // Light Cream
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerInfo: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(89, 144, 192, 0.3)', // Light Blue transparent
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#015185', // Blue Current
    fontWeight: '500',
  }
});