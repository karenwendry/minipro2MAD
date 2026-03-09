import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { router } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function LoginScreen() {
  const [isLoginMode, setIsLoginMode] = useState(true); // True = Login, False = Register
  const [role, setRole] = useState<'Student' | 'Admin'>('Student');
  
  // State Input Form
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); // Hanya untuk Register
  
  const [loading, setLoading] = useState(false);

  // Panggil API dari Convex
  const loginAPI = useMutation(api.users.login);
  const registerAPI = useMutation(api.users.register);

  const handleSubmit = async () => {
    // Validasi input kosong
    if (!nim || !password) {
      Alert.alert("⚠️ Peringatan", "ID dan Password wajib diisi!");
      return;
    }
    if (!isLoginMode && !fullName) {
      Alert.alert("⚠️ Peringatan", "Nama Lengkap wajib diisi untuk mendaftar!");
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        // PROSES LOGIN
        await loginAPI({ nim, password, role });
        // Mengirimkan 'role' ke halaman home
        router.replace({ pathname: '/home', params: { role: role } });
      } else {
        // PROSES REGISTER
        await registerAPI({ nim, password, role, fullName });
        Alert.alert("🎉 Sukses!", "Akun berhasil dibuat. Silakan login menggunakan akun tersebut.");
        // Bersihkan form dan kembali ke mode Login
        setPassword('');
        setFullName('');
        setIsLoginMode(true);
      }
    } catch (error: any) {
      // Tampilkan error dari Convex (misal: "Password salah", "Akun tidak ada")
      Alert.alert("❌ Gagal", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Unklab Library</Text>
          <Text style={styles.subtitle}>
            {isLoginMode ? "Welcome back! Please login." : "Create your new account."}
          </Text>
        </View>

        {/* Tab Pemilihan Role */}
        <View style={styles.roleContainer}>
          <TouchableOpacity 
            style={[styles.roleTab, role === 'Student' && styles.roleActive]}
            onPress={() => setRole('Student')}
          >
            <Text style={[styles.roleText, role === 'Student' && styles.roleTextActive]}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.roleTab, role === 'Admin' && styles.roleActive]}
            onPress={() => setRole('Admin')}
          >
            <Text style={[styles.roleText, role === 'Admin' && styles.roleTextActive]}>Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Form Input */}
        {!isLoginMode && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g. John Doe" 
              placeholderTextColor="#8aa6c1"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{role === 'Student' ? 'NIM' : 'Email'}</Text>
          <TextInput 
            style={styles.input} 
            placeholder={`Enter your ${role === 'Student' ? 'NIM' : 'Email'}`} 
            placeholderTextColor="#8aa6c1"
            value={nim}
            onChangeText={setNim}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Enter your password" 
            placeholderTextColor="#8aa6c1"
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Tombol Submit */}
        <TouchableOpacity style={styles.mainButton} onPress={handleSubmit} disabled={loading}>
          {loading ? (
             <ActivityIndicator color="#ffffff" />
          ) : (
             <Text style={styles.mainButtonText}>{isLoginMode ? "Login" : "Register Account"}</Text>
          )}
        </TouchableOpacity>

        {/* Toggle Login / Register */}
        <TouchableOpacity 
          style={styles.switchModeButton} 
          onPress={() => setIsLoginMode(!isLoginMode)}
        >
          <Text style={styles.switchModeText}>
            {isLoginMode 
              ? "Don't have an account? Register" 
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.secureBadge}>🔒 Secure & Encrypted Authentication</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#faeed5', 
    justifyContent: 'center', 
    padding: 20 
  },
  card: { 
    backgroundColor: '#ffffff', 
    padding: 25, 
    borderRadius: 24, 
    elevation: 8, 
    shadowColor: '#102a6b', 
    shadowOpacity: 0.15, 
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 }
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#102a6b', 
    letterSpacing: 0.5 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#5990c0', 
    marginTop: 5 
  },
  roleContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#f1f5f9',
    borderRadius: 12, 
    padding: 4,
    marginBottom: 20, 
  },
  roleTab: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderRadius: 10,
  },
  roleActive: { 
    backgroundColor: '#102a6b',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleText: { 
    color: '#5990c0', 
    fontWeight: '700',
    fontSize: 15
  },
  roleTextActive: { 
    color: '#ffffff' 
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: { 
    fontSize: 13, 
    fontWeight: '700', 
    color: '#102a6b', 
    marginBottom: 6,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  input: { 
    backgroundColor: '#f8fafc',
    borderWidth: 1.5, 
    borderColor: '#e2e8f0', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 16, 
    color: '#1e293b' 
  },
  mainButton: { 
    backgroundColor: '#102a6b', 
    paddingVertical: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    marginTop: 10,
    elevation: 3,
    shadowColor: '#102a6b',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 }
  },
  mainButtonText: { 
    color: '#ffffff', 
    fontSize: 16, 
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  switchModeButton: { 
    marginTop: 20, 
    alignItems: 'center',
    paddingVertical: 10
  },
  switchModeText: { 
    color: '#5990c0', 
    fontWeight: '600', 
    fontSize: 14 
  },
  secureBadge: { 
    textAlign: 'center', 
    marginTop: 25, 
    color: '#94a3b8', 
    fontSize: 12,
    fontWeight: '500'
  },
});